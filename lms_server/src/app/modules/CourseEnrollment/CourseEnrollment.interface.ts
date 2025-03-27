import { ObjectId } from "mongoose";

export type TEnrollment = {
  user: ObjectId;
  course: ObjectId;
  completed: boolean;
};
