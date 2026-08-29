import { z } from "zod";

const optionSchema = z.object({
  optionText: z.string().min(1, "Option text is required !!!"),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(0),
});

const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required !!!"),
  questionOrder: z.number().int().min(0),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required per question !!!")
    .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
      message: "Exactly one option must be marked correct !!!",
    }),
});

const createQuizSchema = z.object({
  moduleId: z.string().uuid("Invalid module id !!!"),
  title: z.string().min(1, "Quiz title is required !!!"),
  description: z.string().optional(),
  questions: z
    .array(questionSchema)
    .min(1, "At least 1 question is required !!!"),
});

const updateQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required !!!"),
  description: z.string().optional(),
  questions: z
    .array(questionSchema)
    .min(1, "At least 1 question is required !!!"),
});

// keys/values validated as plain non-empty strings here; real question/option
// existence is checked server-side in quiz.service.ts::submitQuiz.
const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

//
export const quizValidationSchema = {
  createQuizSchema,
  updateQuizSchema,
  submitQuizSchema,
};
