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
exports.assignmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
// ! for creating an assignment for a module (one optional assignment per module)
const createAssignment = (instructorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield prisma_1.default.module.findFirst({
        where: { id: payload.moduleId, isDeleted: false },
    });
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This module don't exist !!!");
    }
    if (moduleData.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to add an assignment to this module !!!");
    }
    // moduleId is genuinely unique across ALL rows (active or soft-deleted) —
    // Assignment.moduleId is a hard @unique, not a partial isDeleted:false-scoped
    // index like Video's, because Prisma requires a real @unique for
    // Module.assignment to be a valid singular relation. So a soft-deleted
    // assignment still occupies this module's slot; findUnique (no isDeleted
    // filter) is what actually finds it. Mirrors quiz.service.ts::createQuiz's
    // fix from spec 30 (context/specs/30-quiz-recreate-after-delete-crash.md).
    const existingAssignment = yield prisma_1.default.assignment.findUnique({
        where: { moduleId: payload.moduleId },
    });
    if (existingAssignment && !existingAssignment.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module already has an assignment !!!");
    }
    if (existingAssignment && existingAssignment.isDeleted) {
        // Reactivate the same row instead of inserting a new one — the unique
        // constraint would otherwise reject a second insert for this moduleId.
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Reactivation is a full reset of this module's assignment slot —
            // clear any submissions against the deleted content, or a student's
            // stale (possibly already-graded) submission against the old
            // instructions would silently reappear attached to the new assignment.
            yield tx.assignmentSubmission.deleteMany({
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
        }));
        return result;
    }
    const result = yield prisma_1.default.assignment.create({
        data: {
            moduleId: payload.moduleId,
            instructorId: moduleData.instructorId,
            title: payload.title,
            instructions: payload.instructions,
            dueDate: payload.dueDate,
        },
    });
    return result;
});
// ! for the instructor/admin authoring view of a module's assignment
const getAssignmentForManage = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.assignment.findFirst({
        where: { moduleId, isDeleted: false },
    });
    return result;
});
// ! for updating an assignment
const updateAssignment = (assignmentId, instructorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield prisma_1.default.assignment.findFirst({
        where: { id: assignmentId, isDeleted: false },
    });
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This assignment don't exist !!!");
    }
    if (assignment.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update this assignment !!!");
    }
    const result = yield prisma_1.default.assignment.update({
        where: { id: assignmentId },
        data: {
            title: payload.title,
            instructions: payload.instructions,
            dueDate: payload.dueDate,
        },
    });
    return result;
});
// ! for soft-deleting an assignment
const deleteAssignment = (assignmentId, instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield prisma_1.default.assignment.findFirst({
        where: { id: assignmentId, isDeleted: false },
    });
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This assignment don't exist !!!");
    }
    if (assignment.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to delete this assignment !!!");
    }
    const result = yield prisma_1.default.assignment.update({
        where: { id: assignmentId },
        data: { isDeleted: true },
    });
    return result;
});
// ! for the instructor/admin grading list of an assignment's submissions —
// deliberately unrestricted, same as getAssignmentForManage/quiz's
// getQuizForManage (see spec 31's Design section) — only the writes
// (grade/reopen/create/update/delete) are ownership-gated.
const getAssignmentSubmissions = (assignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield prisma_1.default.assignment.findFirst({
        where: { id: assignmentId, isDeleted: false },
    });
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This assignment don't exist !!!");
    }
    const result = yield prisma_1.default.assignmentSubmission.findMany({
        where: { assignmentId },
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { submittedAt: "desc" },
    });
    return result;
});
// ! for a student opening a module's assignment
const getAssignmentToTake = (userId, courseId, moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield prisma_1.default.assignment.findFirst({
        where: { moduleId, isDeleted: false },
        include: { module: { select: { courseId: true } } },
    });
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This module has no assignment !!!");
    }
    // ValidateCourseAccess only proves the caller is enrolled+paid for the
    // :courseId in the URL, not that this assignment actually belongs to that
    // course — without this check a paid student in course A could look up a
    // moduleId belonging to an unrelated course B.
    if (assignment.module.courseId !== courseId) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This module has no assignment !!!");
    }
    const submission = yield prisma_1.default.assignmentSubmission.findUnique({
        where: { assignmentId_userId: { assignmentId: assignment.id, userId } },
    });
    return {
        assignmentId: assignment.id,
        title: assignment.title,
        instructions: assignment.instructions,
        dueDate: assignment.dueDate,
        submission: submission !== null && submission !== void 0 ? submission : null,
    };
});
// ! for a student submitting/resubmitting an assignment
const submitAssignment = (userId, courseId, assignmentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield prisma_1.default.assignment.findFirst({
        where: { id: assignmentId, isDeleted: false },
        include: { module: { select: { courseId: true } } },
    });
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This assignment don't exist !!!");
    }
    // Same cross-course guard as getAssignmentToTake — see comment there.
    if (assignment.module.courseId !== courseId) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This assignment don't exist !!!");
    }
    const existingSubmission = yield prisma_1.default.assignmentSubmission.findUnique({
        where: { assignmentId_userId: { assignmentId, userId } },
    });
    if (existingSubmission && existingSubmission.status === "graded") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This assignment has already been graded. Ask your instructor to reopen it before resubmitting !!!");
    }
    const result = yield prisma_1.default.assignmentSubmission.upsert({
        where: { assignmentId_userId: { assignmentId, userId } },
        create: { assignmentId, userId, courseId, content, submissionVersion: 1 },
        update: {
            content,
            submissionVersion: { increment: 1 },
            submittedAt: new Date(),
        },
    });
    return result;
});
// ! for an instructor grading a submission
const gradeSubmission = (submissionId, instructorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield prisma_1.default.assignmentSubmission.findFirst({
        where: { id: submissionId },
        include: { assignment: true },
    });
    if (!submission || submission.assignment.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This submission don't exist !!!");
    }
    if (submission.assignment.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to grade this submission !!!");
    }
    const result = yield prisma_1.default.assignmentSubmission.update({
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
});
// ! for an instructor reopening a graded submission for further edits
const reopenSubmission = (submissionId, instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield prisma_1.default.assignmentSubmission.findFirst({
        where: { id: submissionId },
        include: { assignment: true },
    });
    if (!submission || submission.assignment.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This submission don't exist !!!");
    }
    if (submission.assignment.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to reopen this submission !!!");
    }
    const result = yield prisma_1.default.assignmentSubmission.update({
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
});
//
exports.assignmentServices = {
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
