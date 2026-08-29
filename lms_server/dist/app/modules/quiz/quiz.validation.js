"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizValidationSchema = void 0;
const zod_1 = require("zod");
const optionSchema = zod_1.z.object({
    optionText: zod_1.z.string().min(1, "Option text is required !!!"),
    isCorrect: zod_1.z.boolean(),
    optionOrder: zod_1.z.number().int().min(0),
});
const questionSchema = zod_1.z.object({
    questionText: zod_1.z.string().min(1, "Question text is required !!!"),
    questionOrder: zod_1.z.number().int().min(0),
    options: zod_1.z
        .array(optionSchema)
        .min(2, "At least 2 options are required per question !!!")
        .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
        message: "Exactly one option must be marked correct !!!",
    }),
});
const createQuizSchema = zod_1.z.object({
    moduleId: zod_1.z.string().uuid("Invalid module id !!!"),
    title: zod_1.z.string().min(1, "Quiz title is required !!!"),
    description: zod_1.z.string().optional(),
    questions: zod_1.z
        .array(questionSchema)
        .min(1, "At least 1 question is required !!!"),
});
const updateQuizSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Quiz title is required !!!"),
    description: zod_1.z.string().optional(),
    questions: zod_1.z
        .array(questionSchema)
        .min(1, "At least 1 question is required !!!"),
});
// keys/values validated as plain non-empty strings here; real question/option
// existence is checked server-side in quiz.service.ts::submitQuiz.
const submitQuizSchema = zod_1.z.object({
    answers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
});
//
exports.quizValidationSchema = {
    createQuizSchema,
    updateQuizSchema,
    submitQuizSchema,
};
