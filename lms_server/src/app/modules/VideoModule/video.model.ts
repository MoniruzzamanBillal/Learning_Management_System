import { model, Schema } from "mongoose";
import { TVideo } from "./Video.interface";

const videoSchema = new Schema<TVideo>(
  {
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoUrl: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

videoSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

videoSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

videoSchema.pre("findOne", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//

export const videoModel = model<TVideo>("Video", videoSchema);
