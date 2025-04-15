import { ObjectId } from "mongoose";
import { videoProgressStatus } from "./VideoProgress.constants";

export type TVideoProgress = {
  user: ObjectId;
  course: ObjectId;
  module: ObjectId;
  video: ObjectId;
  videoStatus: keyof typeof videoProgressStatus;
};
