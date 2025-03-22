import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid object id !!!",
  });

// ! for creating a module
const createModuleValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course: objectIdSchema,
  videos: z.array(objectIdSchema).optional(),
});

//
export const moduleValidations = {
  createModuleValidationSchema,
};
