import { z } from "zod";

//  ! for adding new course schema
export const addCourseValidationSchema = z.object({
  name: z.string().min(1, "Course Name is required !!!"),
  description: z.string().min(1, "Course Description is required !!!"),
  price: z
    .number({ invalid_type_error: "Course Price is required !!!" })
    .nonnegative("Price must be non-negative"),
  category: z.string().min(1, "Course Category is required !!!"),
  instructors: z.array(z.string()).min(1, "Select at least one instructor!"),
  image: z.any().optional(),
});

export const updateCourseValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative("Price must be non-negative")
    .optional(),
  category: z.string().optional(),
  instructors: z.array(z.string()).optional(),
  image: z.any().optional(),
});

//
export const courseSchemas = {
  addCourseValidationSchema,
  updateCourseValidationSchema,
};
