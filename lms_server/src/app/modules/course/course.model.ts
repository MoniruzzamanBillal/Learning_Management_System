import { model, Schema } from "mongoose";
import { TCourse } from "./course.interface";

const courseSchema = new Schema<TCourse>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    published: { type: Boolean, default: false },
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  { timestamps: true }
);

//
export const courseModel = model<TCourse>("Course", courseSchema);
