import { ObjectId } from "mongoose";
import { PAYMENTSTATUS } from "./payment.constant";

export type TPayment = {
  user: ObjectId;
  course: ObjectId;
  CourseEnrollment: ObjectId;
  paymentStatus: keyof typeof PAYMENTSTATUS;
  amount: number;
  transactionId: string;
  isDeleted?: boolean;
};
