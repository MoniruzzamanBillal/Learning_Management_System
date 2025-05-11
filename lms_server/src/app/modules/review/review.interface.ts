import { Types } from "mongoose";

export type TReview = {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  rating: number;
  comment: string;
  isDeleted?: boolean;
};
