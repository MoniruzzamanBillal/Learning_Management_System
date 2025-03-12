import { z } from "zod";

//   ! validation  for login
const loginValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

//
export const authValidations = {
  loginValidationSchema,
};
