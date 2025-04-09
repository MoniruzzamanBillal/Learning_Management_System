import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid object id !!!",
  });

// ! for crating course
const crateCourseValidationSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  category: z.string().min(1, "Category is required"),
  instructors: z.array(objectIdSchema).optional(),
  modules: z.array(objectIdSchema).optional(),
});

// ! for updating course
const updateCourseValidationSchema = z.object({
  name: z.string().min(1, "Course name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z
    .number()
    .nonnegative("Price must be a non-negative number")
    .optional(),
  category: z.string().min(1, "Category is required").optional(),
});

//
export const courseValidations = {
  crateCourseValidationSchema,
  updateCourseValidationSchema,
};
