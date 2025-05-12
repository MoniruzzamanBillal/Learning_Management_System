import { model, Schema } from "mongoose";
import { PAYMENTSTATUS } from "./payment.constant";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    CourseEnrollment: {
      type: Schema.Types.ObjectId,
      ref: "CourseEnrollment",
    },
    paymentStatus: {
      type: String,
      default: PAYMENTSTATUS.Pending,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//
export const paymentModel = model<TPayment>("Payment", paymentSchema);
