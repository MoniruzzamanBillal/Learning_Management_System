/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseEnrollmentModel } from "../CourseEnrollment/CourseEnrollment.model";
import { PAYMENTSTATUS } from "./payment.constant";
import { paymentModel } from "./payment.model";

// ! after successfully payment
const successfullyPayment = async (payload: any) => {
  const { tran_id, status } = payload;

  if (status !== "VALID") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Failed !!!");
  }

  const updatedPaymentResult = await paymentModel.findOneAndUpdate(
    { transactionId: tran_id },
    { paymentStatus: PAYMENTSTATUS.Completed },
    { new: true, runValidators: true }
  );

  return updatedPaymentResult;

  //
};

// ! for fail paymnet
const failPayment = async (payload: any) => {
  const { tran_id, status } = payload;

  if (status === "FAILED") {
    //

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const updatedPaymentData = await paymentModel.findOneAndUpdate(
        { transactionId: tran_id, paymentStatus: PAYMENTSTATUS.Pending },
        { isDeleted: true },
        { new: true, runValidators: true, session }
      );

      const courseEnrollmentData = await courseEnrollmentModel.findOneAndUpdate(
        { Payment: updatedPaymentData?._id },
        { isDeleted: true },
        { new: true, runValidators: true, session }
      );

      await session.commitTransaction();
      await session.endSession();

      return courseEnrollmentData;
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();

      console.log(error);
      throw new Error(error);
    }

    //
  }

  //
};

//
export const paymentServices = {
  successfullyPayment,
  failPayment,
};
