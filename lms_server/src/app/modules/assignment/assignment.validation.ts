import { z } from "zod";

const createAssignmentSchema = z.object({
  moduleId: z.string().uuid("Invalid module id !!!"),
  title: z.string().min(1, "Assignment title is required !!!"),
  instructions: z.string().min(1, "Instructions are required !!!"),
  dueDate: z.coerce.date().optional(),
});

const updateAssignmentSchema = z.object({
  title: z.string().min(1, "Assignment title is required !!!"),
  instructions: z.string().min(1, "Instructions are required !!!"),
  dueDate: z.coerce.date().optional(),
});

const submitAssignmentSchema = z.object({
  content: z.string().min(1, "Submission cannot be empty !!!"),
});

const gradeSubmissionSchema = z.object({
  score: z
    .number()
    .int()
    .min(0, "Score cannot be negative !!!")
    .max(10, "Score cannot exceed 10 !!!"),
  feedback: z.string().optional(),
});

export const assignmentValidationSchema = {
  createAssignmentSchema,
  updateAssignmentSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
};
