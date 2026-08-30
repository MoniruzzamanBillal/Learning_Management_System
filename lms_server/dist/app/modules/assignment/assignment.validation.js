"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentValidationSchema = void 0;
const zod_1 = require("zod");
const createAssignmentSchema = zod_1.z.object({
    moduleId: zod_1.z.string().uuid("Invalid module id !!!"),
    title: zod_1.z.string().min(1, "Assignment title is required !!!"),
    instructions: zod_1.z.string().min(1, "Instructions are required !!!"),
    dueDate: zod_1.z.coerce.date().optional(),
});
const updateAssignmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Assignment title is required !!!"),
    instructions: zod_1.z.string().min(1, "Instructions are required !!!"),
    dueDate: zod_1.z.coerce.date().optional(),
});
const submitAssignmentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Submission cannot be empty !!!"),
});
const gradeSubmissionSchema = zod_1.z.object({
    score: zod_1.z
        .number()
        .int()
        .min(0, "Score cannot be negative !!!")
        .max(10, "Score cannot exceed 10 !!!"),
    feedback: zod_1.z.string().optional(),
});
exports.assignmentValidationSchema = {
    createAssignmentSchema,
    updateAssignmentSchema,
    submitAssignmentSchema,
    gradeSubmissionSchema,
};
