import { model, Schema } from "mongoose";
import { TEnrollment } from "./CourseEnrollment.interface";

const courseEnrollmentSchema = new Schema<TEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//
export const courseEnrollmentModel = model<TEnrollment>(
  "CourseEnrollment",
  courseEnrollmentSchema
);
