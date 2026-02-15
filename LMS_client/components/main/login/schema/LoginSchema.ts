import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .nonempty("Email is required")
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .nonempty("Password is required")
    .refine((val) => val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
