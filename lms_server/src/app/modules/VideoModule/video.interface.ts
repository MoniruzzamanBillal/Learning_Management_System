import { ObjectId } from "mongoose";
import { videoStatus } from "./video.constants";

export type TVideo = {
  module: ObjectId;
  title: string;
  videoUrl: string;
  instructor: ObjectId;
  videoOrder: number;
  videoStatus: keyof typeof videoStatus;
  isDeleted?: boolean;
};
