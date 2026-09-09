import { z } from "zod";

const objectIdSchema = z.string().uuid({ message: "Invalid id !!!" });

// ! for adding video
const addVideoValidationSchema = z.object({
  module: objectIdSchema,
  title: z.string().min(1, "Title is required"),
  instructor: objectIdSchema,
  videoUrl: z.string().url("Invalid video URL"),
});

//
export const videoValidationSchemas = {
  addVideoValidationSchema,
};
