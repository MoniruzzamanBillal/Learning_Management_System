import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid onject id !!!",
  });

// ! for crating course
const crateCourseValidationSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  category: z.string().min(1, "Category is required"),
  instructor: objectIdSchema.optional(),
  modules: z.array(objectIdSchema).optional(),
});

//
export const courseValidations = {
  crateCourseValidationSchema,
};
