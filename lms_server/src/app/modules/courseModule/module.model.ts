import { model, Schema } from "mongoose";
import { TModule } from "./module.interface";

const moduleSchema = new Schema<TModule>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

moduleSchema.pre("find", async function (next) {
  this.where({ isDeleted: false });
  next();
});

moduleSchema.pre("findOne", async function (next) {
  this.where({ isDeleted: false });
  next();
});

//
export const moduleModel = model<TModule>("Module", moduleSchema);
