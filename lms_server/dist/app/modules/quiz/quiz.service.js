"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("../../../generated/prisma/client");
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
// ! for creating a quiz for a module (one optional quiz per module)
const createQuiz = (instructorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield prisma_1.default.module.findFirst({
        where: { id: payload.moduleId, isDeleted: false },
    });
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This module don't exist !!!");
    }
    if (moduleData.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to add a quiz to this module !!!");
    }
    // moduleId is genuinely unique across ALL rows (active or soft-deleted) —
    // Quiz.moduleId is a hard @unique, not a partial index like Video's,
    // because Prisma requires a real @unique for Module.quiz to be a valid
    // singular relation. So a soft-deleted quiz still occupies this module's
    // slot; findUnique (no isDeleted filter) is what actually finds it.
    const existingQuiz = yield prisma_1.default.quiz.findUnique({
        where: { moduleId: payload.moduleId },
    });
    if (existingQuiz && !existingQuiz.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module already has a quiz !!!");
    }
    if (existingQuiz && existingQuiz.isDeleted) {
        // Reactivate the same row instead of inserting a new one — the unique
        // constraint would otherwise reject a second insert for this moduleId.
        // Mirrors VideoNote.service.ts::upsertVideoNote's reactivation pattern.
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Reactivation is a full reset of this module's quiz slot — clear any
            // attempts against the deleted content too, or a student who took the
            // old version would be permanently locked out of the new one (their
            // old QuizAttempt row would still satisfy @@unique([userId, quizId])).
            yield tx.quizAttempt.deleteMany({ where: { quizId: existingQuiz.id } });
            yield replaceQuizQuestions(tx, existingQuiz.id, payload.questions);
            return tx.quiz.update({
                where: { id: existingQuiz.id },
                data: {
                    title: payload.title,
                    description: payload.description,
                    isDeleted: false,
                },
                include: { questions: { include: { options: true } } },
            });
        }));
        return result;
    }
    const result = yield prisma_1.default.quiz.create({
        data: {
            moduleId: payload.moduleId,
            instructorId: moduleData.instructorId,
            title: payload.title,
            description: payload.description,
            questions: {
                create: payload.questions.map((q) => ({
                    questionText: q.questionText,
                    questionOrder: q.questionOrder,
                    options: { create: q.options.map((o) => (Object.assign({}, o))) },
                })),
            },
        },
        include: { questions: { include: { options: true } } },
    });
    return result;
});
// ! for the instructor/admin authoring view (includes isCorrect)
const getQuizForManage = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.quiz.findFirst({
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
});
// ! shared by createQuiz's reactivation branch and updateQuiz: deletes a
// quiz's existing questions/options, then creates the new set in their place
const replaceQuizQuestions = (tx, quizId, questions) => __awaiter(void 0, void 0, void 0, function* () {
    const existingQuestions = yield tx.quizQuestion.findMany({
        where: { quizId },
        select: { id: true },
    });
    const questionIds = existingQuestions.map((q) => q.id);
    if (questionIds.length) {
        yield tx.quizOption.deleteMany({
            where: { questionId: { in: questionIds } },
        });
        yield tx.quizQuestion.deleteMany({ where: { quizId } });
    }
    for (const q of questions) {
        yield tx.quizQuestion.create({
            data: {
                quizId,
                questionText: q.questionText,
                questionOrder: q.questionOrder,
                options: { create: q.options.map((o) => (Object.assign({}, o))) },
            },
        });
    }
});
// ! for updating a quiz (full question/option replace)
const updateQuiz = (quizId, instructorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield prisma_1.default.quiz.findFirst({
        where: { id: quizId, isDeleted: false },
    });
    if (!quiz) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This quiz don't exist !!!");
    }
    if (quiz.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update this quiz !!!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield replaceQuizQuestions(tx, quizId, payload.questions);
        return tx.quiz.update({
            where: { id: quizId },
            data: {
                title: payload.title,
                description: payload.description,
            },
            include: { questions: { include: { options: true } } },
        });
    }));
    return result;
});
// ! for soft-deleting a quiz
const deleteQuiz = (quizId, instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield prisma_1.default.quiz.findFirst({
        where: { id: quizId, isDeleted: false },
    });
    if (!quiz) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This quiz don't exist !!!");
    }
    if (quiz.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to delete this quiz !!!");
    }
    const result = yield prisma_1.default.quiz.update({
        where: { id: quizId },
        data: { isDeleted: true },
    });
    return result;
});
// ! shapes the take/submit response, coloring each option against one attempt
const buildQuizResultPayload = (quiz, attempt) => {
    var _a;
    const answers = ((_a = attempt.answers) !== null && _a !== void 0 ? _a : {});
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
const getQuizToTake = (userId, courseId, moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield prisma_1.default.quiz.findFirst({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This module has no quiz !!!");
    }
    const attempt = yield prisma_1.default.quizAttempt.findFirst({
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
});
// ! for a student submitting a quiz — exactly one attempt allowed, ever
const submitQuiz = (userId, courseId, quizId, answers) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield prisma_1.default.quiz.findFirst({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This quiz don't exist !!!");
    }
    // ValidateCourseAccess only proves the caller is enrolled+paid for the
    // :courseId in the URL, not that this quizId actually belongs to that
    // course — without this check a paid student in course A could submit a
    // quizId belonging to a module of an unrelated course B.
    if (quiz.module.courseId !== courseId) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This quiz don't exist !!!");
    }
    let score = 0;
    quiz.questions.forEach((q) => {
        const selectedOptionId = answers[q.id];
        const correctOption = q.options.find((o) => o.isCorrect);
        if (selectedOptionId && (correctOption === null || correctOption === void 0 ? void 0 : correctOption.id) === selectedOptionId) {
            score += 1;
        }
    });
    let attempt;
    try {
        attempt = yield prisma_1.default.quizAttempt.create({
            data: {
                quizId,
                userId,
                courseId,
                score,
                totalQuestions: quiz.questions.length,
                answers,
            },
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already submitted this quiz !!!");
        }
        throw error;
    }
    return buildQuizResultPayload(quiz, attempt);
});
//
exports.quizServices = {
    createQuiz,
    getQuizForManage,
    updateQuiz,
    deleteQuiz,
    getQuizToTake,
    submitQuiz,
};
