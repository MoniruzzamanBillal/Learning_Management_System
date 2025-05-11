import { model, Schema } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required "],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required "],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required !!"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required !!"],
    },
  },
  { timestamps: true }
);

//
export const reviewModel = model<TReview>("Review", reviewSchema);
