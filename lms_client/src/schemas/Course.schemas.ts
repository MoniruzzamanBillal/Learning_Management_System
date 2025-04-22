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

//
export const courseSchemas = {
  addCourseValidationSchema,
};
