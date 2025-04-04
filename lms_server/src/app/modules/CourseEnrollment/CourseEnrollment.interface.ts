import { ObjectId } from "mongoose";

export type TEnrollment = {
  user: ObjectId;
  course: ObjectId;
  Payment: ObjectId;
  completed: boolean;
  isDeleted?: boolean;
};
