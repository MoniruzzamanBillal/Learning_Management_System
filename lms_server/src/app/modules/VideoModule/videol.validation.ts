import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid object id !!!",
  });

// ! for adding video
const addVideoValidationSchema = z.object({
  module: objectIdSchema,
  title: z.string().min(1, "Title is required"),

  videoUrl: z.string().min(1, "Invalid video URL"),
  instructor: objectIdSchema,
});

//
export const videoValidationSchemas = {
  addVideoValidationSchema,
};
