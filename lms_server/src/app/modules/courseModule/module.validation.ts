import { z } from "zod";

const objectIdSchema = z.string().uuid({ message: "Invalid id !!!" });

// ! for creating a module
const createModuleValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course: objectIdSchema,
  videos: z.array(objectIdSchema).optional(),
  instructor: objectIdSchema.optional(),
});

//
export const moduleValidations = {
  createModuleValidationSchema,
};
