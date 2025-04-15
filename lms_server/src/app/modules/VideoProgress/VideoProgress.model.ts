import { model, Schema } from "mongoose";
import { TVideoProgress } from "./VideoProgress.interface";
import { videoProgressStatus } from "./VideoProgress.constants";

const videoProgressSchema = new Schema<TVideoProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    videoStatus: {
      type: String,
      enum: Object.values(videoProgressStatus),
    },
  },
  { timestamps: true }
);

//

export const videoProgressModel = model<TVideoProgress>(
  "VideoProgress",
  videoProgressSchema
);
