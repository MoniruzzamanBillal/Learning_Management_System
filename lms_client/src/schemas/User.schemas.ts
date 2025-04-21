import { z } from "zod";

// ! schema for creating a instructor
export const addInstructorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password is required and should be atleast 6 characters"),
  image: z.any().optional(),
});

//
export const userSchemas = {
  addInstructorSchema,
};
