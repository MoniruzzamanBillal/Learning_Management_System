import { z } from "zod";

const addReviewSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User id is required !!!"),
    courseId: z.string().min(1, "course id is required !!!"),
    comment: z.string().min(2, "comment is required !!!"),
    rating: z
      .number()
      .min(1, { message: "Rating must be at least 1" })
      .max(5, { message: "Rating must not exceed 5" }),
  }),
});

//
export const reviewValidationSchema = {
  addReviewSchema,
};
