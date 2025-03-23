import { ObjectId } from "mongoose";

export type TVideo = {
  module: ObjectId;
  title: string;
  videoUrl: string;
  instructor: ObjectId;
  isDeleted?: boolean;
};
