import { z } from "zod";

export const assignmentFormValidationSchema = z.object({
  title: z.string().min(1, "Assignment title is required !!!"),
  instructions: z.string().min(1, "Instructions are required !!!"),
  dueDate: z.string().optional(),
});
