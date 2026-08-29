import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";

type TOptionPayload = {
  optionText: string;
  isCorrect: boolean;
  optionOrder: number;
};

type TQuestionPayload = {
  questionText: string;
  questionOrder: number;
  options: TOptionPayload[];
};

type TCreateQuizPayload = {
  moduleId: string;
  title: string;
  description?: string;
  questions: TQuestionPayload[];
};

type TUpdateQuizPayload = {
  title: string;
  description?: string;
  questions: TQuestionPayload[];
};

// ! for creating a quiz for a module (one optional quiz per module)
const createQuiz = async (instructorId: string, payload: TCreateQuizPayload) => {
  const moduleData = await prisma.module.findFirst({
    where: { id: payload.moduleId, isDeleted: false },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.NOT_FOUND, "This module don't exist !!!");
  }

  if (moduleData.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to add a quiz to this module !!!",
    );
  }

  // moduleId is genuinely unique across ALL rows (active or soft-deleted) —
  // Quiz.moduleId is a hard @unique, not a partial index like Video's,
  // because Prisma requires a real @unique for Module.quiz to be a valid
  // singular relation. So a soft-deleted quiz still occupies this module's
  // slot; findUnique (no isDeleted filter) is what actually finds it.
  const existingQuiz = await prisma.quiz.findUnique({
    where: { moduleId: payload.moduleId },
  });

  if (existingQuiz && !existingQuiz.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This module already has a quiz !!!",
    );
  }

  if (existingQuiz && existingQuiz.isDeleted) {
    // Reactivate the same row instead of inserting a new one — the unique
    // constraint would otherwise reject a second insert for this moduleId.
    // Mirrors VideoNote.service.ts::upsertVideoNote's reactivation pattern.
    const result = await prisma.$transaction(async (tx) => {
      // Reactivation is a full reset of this module's quiz slot — clear any
      // attempts against the deleted content too, or a student who took the
      // old version would be permanently locked out of the new one (their
      // old QuizAttempt row would still satisfy @@unique([userId, quizId])).
      await tx.quizAttempt.deleteMany({ where: { quizId: existingQuiz.id } });
      await replaceQuizQuestions(tx, existingQuiz.id, payload.questions);

      return tx.quiz.update({
        where: { id: existingQuiz.id },
        data: {
          title: payload.title,
          description: payload.description,
          isDeleted: false,
        },
        include: { questions: { include: { options: true } } },
      });
    });

    return result;
  }

  const result = await prisma.quiz.create({
    data: {
      moduleId: payload.moduleId,
      instructorId: moduleData.instructorId,
      title: payload.title,
      description: payload.description,
      questions: {
        create: payload.questions.map((q) => ({
          questionText: q.questionText,
          questionOrder: q.questionOrder,
          options: { create: q.options.map((o) => ({ ...o })) },
        })),
      },
    },
    include: { questions: { include: { options: true } } },
  });

  return result;
};

// ! for the instructor/admin authoring view (includes isCorrect)
const getQuizForManage = async (moduleId: string) => {
  const result = await prisma.quiz.findFirst({
    where: { moduleId, isDeleted: false },
    include: {
      questions: {
        where: { isDeleted: false },
        orderBy: { questionOrder: "asc" },
        include: { options: { orderBy: { optionOrder: "asc" } } },
      },
    },
  });

  return result;
};

// ! shared by createQuiz's reactivation branch and updateQuiz: deletes a
// quiz's existing questions/options, then creates the new set in their place
const replaceQuizQuestions = async (
  tx: Prisma.TransactionClient,
  quizId: string,
  questions: TQuestionPayload[],
) => {
  const existingQuestions = await tx.quizQuestion.findMany({
    where: { quizId },
    select: { id: true },
  });

  const questionIds = existingQuestions.map((q) => q.id);

  if (questionIds.length) {
    await tx.quizOption.deleteMany({
      where: { questionId: { in: questionIds } },
    });
    await tx.quizQuestion.deleteMany({ where: { quizId } });
  }

  for (const q of questions) {
    await tx.quizQuestion.create({
      data: {
        quizId,
        questionText: q.questionText,
        questionOrder: q.questionOrder,
        options: { create: q.options.map((o) => ({ ...o })) },
      },
    });
  }
};

// ! for updating a quiz (full question/option replace)
const updateQuiz = async (
  quizId: string,
  instructorId: string,
  payload: TUpdateQuizPayload,
) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, isDeleted: false },
  });

  if (!quiz) {
    throw new AppError(httpStatus.NOT_FOUND, "This quiz don't exist !!!");
  }

  if (quiz.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this quiz !!!",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    await replaceQuizQuestions(tx, quizId, payload.questions);

    return tx.quiz.update({
      where: { id: quizId },
      data: {
        title: payload.title,
        description: payload.description,
      },
      include: { questions: { include: { options: true } } },
    });
  });

  return result;
};

// ! for soft-deleting a quiz
const deleteQuiz = async (quizId: string, instructorId: string) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, isDeleted: false },
  });

  if (!quiz) {
    throw new AppError(httpStatus.NOT_FOUND, "This quiz don't exist !!!");
  }

  if (quiz.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this quiz !!!",
    );
  }

  const result = await prisma.quiz.update({
    where: { id: quizId },
    data: { isDeleted: true },
  });

  return result;
};

// ! shapes the take/submit response, coloring each option against one attempt
const buildQuizResultPayload = (
  quiz: Prisma.QuizGetPayload<{
    include: { questions: { include: { options: true } } };
  }>,
  attempt: { id: string; score: number; totalQuestions: number; answers: Prisma.JsonValue },
) => {
  const answers = (attempt.answers ?? {}) as Record<string, string>;

  return {
    attemptId: attempt.id,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    questions: quiz.questions.map((q) => ({
      questionId: q.id,
      questionText: q.questionText,
      options: q.options.map((o) => ({
        optionId: o.id,
        optionText: o.optionText,
        isCorrect: o.isCorrect,
        wasSelected: answers[q.id] === o.id,
      })),
    })),
  };
};

// ! for a student opening a module's quiz — results mode if already attempted
const getQuizToTake = async (
  userId: string,
  courseId: string,
  moduleId: string,
) => {
  const quiz = await prisma.quiz.findFirst({
    where: { moduleId, isDeleted: false },
    include: {
      questions: {
        where: { isDeleted: false },
        orderBy: { questionOrder: "asc" },
        include: { options: { orderBy: { optionOrder: "asc" } } },
      },
    },
  });

  if (!quiz) {
    throw new AppError(httpStatus.NOT_FOUND, "This module has no quiz !!!");
  }

  const attempt = await prisma.quizAttempt.findFirst({
    where: { userId, quizId: quiz.id },
  });

  if (attempt) {
    return buildQuizResultPayload(quiz, attempt);
  }

  return {
    quizId: quiz.id,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map((q) => ({
      questionId: q.id,
      questionText: q.questionText,
      options: q.options.map((o) => ({
        optionId: o.id,
        optionText: o.optionText,
      })),
    })),
  };

  //
};

// ! for a student submitting a quiz — exactly one attempt allowed, ever
const submitQuiz = async (
  userId: string,
  courseId: string,
  quizId: string,
  answers: Record<string, string>,
) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, isDeleted: false },
    include: {
      module: { select: { courseId: true } },
      questions: {
        where: { isDeleted: false },
        orderBy: { questionOrder: "asc" },
        include: { options: { orderBy: { optionOrder: "asc" } } },
      },
    },
  });

  if (!quiz) {
    throw new AppError(httpStatus.NOT_FOUND, "This quiz don't exist !!!");
  }

  // ValidateCourseAccess only proves the caller is enrolled+paid for the
  // :courseId in the URL, not that this quizId actually belongs to that
  // course — without this check a paid student in course A could submit a
  // quizId belonging to a module of an unrelated course B.
  if (quiz.module.courseId !== courseId) {
    throw new AppError(httpStatus.NOT_FOUND, "This quiz don't exist !!!");
  }

  let score = 0;

  quiz.questions.forEach((q) => {
    const selectedOptionId = answers[q.id];
    const correctOption = q.options.find((o) => o.isCorrect);

    if (selectedOptionId && correctOption?.id === selectedOptionId) {
      score += 1;
    }
  });

  let attempt;

  try {
    attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        courseId,
        score,
        totalQuestions: quiz.questions.length,
        answers,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You have already submitted this quiz !!!",
      );
    }
    throw error;
  }

  return buildQuizResultPayload(quiz, attempt);
};

//
export const quizServices = {
  createQuiz,
  getQuizForManage,
  updateQuiz,
  deleteQuiz,
  getQuizToTake,
  submitQuiz,
};
