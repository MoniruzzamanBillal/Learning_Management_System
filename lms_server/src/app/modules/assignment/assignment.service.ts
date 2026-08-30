import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";

type TCreateAssignmentPayload = {
  moduleId: string;
  title: string;
  instructions: string;
  dueDate?: Date;
};

type TUpdateAssignmentPayload = {
  title: string;
  instructions: string;
  dueDate?: Date;
};

// ! for creating an assignment for a module (one optional assignment per module)
const createAssignment = async (
  instructorId: string,
  payload: TCreateAssignmentPayload,
) => {
  const moduleData = await prisma.module.findFirst({
    where: { id: payload.moduleId, isDeleted: false },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.NOT_FOUND, "This module don't exist !!!");
  }

  if (moduleData.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to add an assignment to this module !!!",
    );
  }

  // moduleId is genuinely unique across ALL rows (active or soft-deleted) —
  // Assignment.moduleId is a hard @unique, not a partial isDeleted:false-scoped
  // index like Video's, because Prisma requires a real @unique for
  // Module.assignment to be a valid singular relation. So a soft-deleted
  // assignment still occupies this module's slot; findUnique (no isDeleted
  // filter) is what actually finds it. Mirrors quiz.service.ts::createQuiz's
  // fix from spec 30 (context/specs/30-quiz-recreate-after-delete-crash.md).
  const existingAssignment = await prisma.assignment.findUnique({
    where: { moduleId: payload.moduleId },
  });

  if (existingAssignment && !existingAssignment.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This module already has an assignment !!!",
    );
  }

  if (existingAssignment && existingAssignment.isDeleted) {
    // Reactivate the same row instead of inserting a new one — the unique
    // constraint would otherwise reject a second insert for this moduleId.
    const result = await prisma.$transaction(async (tx) => {
      // Reactivation is a full reset of this module's assignment slot —
      // clear any submissions against the deleted content, or a student's
      // stale (possibly already-graded) submission against the old
      // instructions would silently reappear attached to the new assignment.
      await tx.assignmentSubmission.deleteMany({
        where: { assignmentId: existingAssignment.id },
      });

      return tx.assignment.update({
        where: { id: existingAssignment.id },
        data: {
          title: payload.title,
          instructions: payload.instructions,
          dueDate: payload.dueDate,
          isDeleted: false,
        },
      });
    });

    return result;
  }

  const result = await prisma.assignment.create({
    data: {
      moduleId: payload.moduleId,
      instructorId: moduleData.instructorId,
      title: payload.title,
      instructions: payload.instructions,
      dueDate: payload.dueDate,
    },
  });

  return result;
};

// ! for the instructor/admin authoring view of a module's assignment
const getAssignmentForManage = async (moduleId: string) => {
  const result = await prisma.assignment.findFirst({
    where: { moduleId, isDeleted: false },
  });

  return result;
};

// ! for updating an assignment
const updateAssignment = async (
  assignmentId: string,
  instructorId: string,
  payload: TUpdateAssignmentPayload,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, isDeleted: false },
  });

  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "This assignment don't exist !!!");
  }

  if (assignment.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this assignment !!!",
    );
  }

  const result = await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      title: payload.title,
      instructions: payload.instructions,
      dueDate: payload.dueDate,
    },
  });

  return result;
};

// ! for soft-deleting an assignment
const deleteAssignment = async (assignmentId: string, instructorId: string) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, isDeleted: false },
  });

  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "This assignment don't exist !!!");
  }

  if (assignment.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this assignment !!!",
    );
  }

  const result = await prisma.assignment.update({
    where: { id: assignmentId },
    data: { isDeleted: true },
  });

  return result;
};

// ! for the instructor/admin grading list of an assignment's submissions —
// deliberately unrestricted, same as getAssignmentForManage/quiz's
// getQuizForManage (see spec 31's Design section) — only the writes
// (grade/reopen/create/update/delete) are ownership-gated.
const getAssignmentSubmissions = async (assignmentId: string) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, isDeleted: false },
  });

  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "This assignment don't exist !!!");
  }

  const result = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { submittedAt: "desc" },
  });

  return result;
};

// ! for a student opening a module's assignment
const getAssignmentToTake = async (
  userId: string,
  courseId: string,
  moduleId: string,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: { moduleId, isDeleted: false },
    include: { module: { select: { courseId: true } } },
  });

  if (!assignment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This module has no assignment !!!",
    );
  }

  // ValidateCourseAccess only proves the caller is enrolled+paid for the
  // :courseId in the URL, not that this assignment actually belongs to that
  // course — without this check a paid student in course A could look up a
  // moduleId belonging to an unrelated course B.
  if (assignment.module.courseId !== courseId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This module has no assignment !!!",
    );
  }

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_userId: { assignmentId: assignment.id, userId } },
  });

  return {
    assignmentId: assignment.id,
    title: assignment.title,
    instructions: assignment.instructions,
    dueDate: assignment.dueDate,
    submission: submission ?? null,
  };
};

// ! for a student submitting/resubmitting an assignment
const submitAssignment = async (
  userId: string,
  courseId: string,
  assignmentId: string,
  content: string,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, isDeleted: false },
    include: { module: { select: { courseId: true } } },
  });

  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "This assignment don't exist !!!");
  }

  // Same cross-course guard as getAssignmentToTake — see comment there.
  if (assignment.module.courseId !== courseId) {
    throw new AppError(httpStatus.NOT_FOUND, "This assignment don't exist !!!");
  }

  const existingSubmission = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_userId: { assignmentId, userId } },
  });

  if (existingSubmission && existingSubmission.status === "graded") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This assignment has already been graded. Ask your instructor to reopen it before resubmitting !!!",
    );
  }

  const result = await prisma.assignmentSubmission.upsert({
    where: { assignmentId_userId: { assignmentId, userId } },
    create: { assignmentId, userId, courseId, content, submissionVersion: 1 },
    update: {
      content,
      submissionVersion: { increment: 1 },
      submittedAt: new Date(),
    },
  });

  return result;
};

// ! for an instructor grading a submission
const gradeSubmission = async (
  submissionId: string,
  instructorId: string,
  payload: { score: number; feedback?: string },
) => {
  const submission = await prisma.assignmentSubmission.findFirst({
    where: { id: submissionId },
    include: { assignment: true },
  });

  if (!submission || submission.assignment.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This submission don't exist !!!");
  }

  if (submission.assignment.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to grade this submission !!!",
    );
  }

  const result = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      score: payload.score,
      feedback: payload.feedback,
      status: "graded",
      gradedByInstructorId: instructorId,
      gradedAt: new Date(),
    },
  });

  return result;
};

// ! for an instructor reopening a graded submission for further edits
const reopenSubmission = async (submissionId: string, instructorId: string) => {
  const submission = await prisma.assignmentSubmission.findFirst({
    where: { id: submissionId },
    include: { assignment: true },
  });

  if (!submission || submission.assignment.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This submission don't exist !!!");
  }

  if (submission.assignment.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to reopen this submission !!!",
    );
  }

  const result = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      status: "submitted",
      score: null,
      feedback: null,
      gradedByInstructorId: null,
      gradedAt: null,
    },
  });

  return result;
};

//
export const assignmentServices = {
  createAssignment,
  getAssignmentForManage,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  getAssignmentToTake,
  submitAssignment,
  gradeSubmission,
  reopenSubmission,
};
