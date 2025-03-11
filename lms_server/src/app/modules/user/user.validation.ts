import { z } from "zod";

// ! for creating a user
const createUserValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(4, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//
export const userValidationSchemas = {
  createUserValidationSchema,
};
