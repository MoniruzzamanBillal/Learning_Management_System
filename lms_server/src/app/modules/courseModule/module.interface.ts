import { ObjectId } from "mongoose";

export type TModule = {
  course: ObjectId;
  title: string;
  videos?: ObjectId[];
  instructor?: ObjectId[];
  isDeleted?: boolean;
};
