import { model, Schema } from "mongoose";
import { TPayment } from "./payment.interface";
import { PAYMENTSTATUS } from "./payment.constant";

const paymentSchema = new Schema<TPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    CourseEnrollment: {
      type: Schema.Types.ObjectId,
      ref: "CourseEnrollment",
      required: true,
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
  },
  { timestamps: true }
);

//
export const paymentModel = model<TPayment>("Payment", paymentSchema);
