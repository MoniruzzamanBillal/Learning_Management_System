import axios from "axios";
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../Error/AppError";
import { courseEnrollmentModel } from "../CourseEnrollment/CourseEnrollment.model";
import { PAYMENTSTATUS } from "./payment.constant";
import { paymentModel } from "./payment.model";

// ! for validating payment
const validatePayment = async (payload: any) => {
  if (!payload || !payload?.status || !(payload?.status === "VALID")) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Payment ");
  }

  const response = await axios({
    method: "GET",
    url: `${config.SSL_VALIDATION_URL}?val_id=${payload?.val_id}&store_id=${config.STORE_ID}&store_passwd=${config.STORE_PASSWORD}&format=json`,
  });

  if ((!response?.status as unknown) === "VALID ") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Failed !!!");
  }

  const transactionId = response?.tran_id;

  const result = await paymentModel.findOneAndUpdate(
    { transactionId },
    { paymentStatus: PAYMENTSTATUS.Completed },
    { new: true }
  );

  return result;

  //
};

// ! after successfully payment
const successfullyPayment = async (payload) => {
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
const failPayment = async (payload) => {
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
  validatePayment,
  successfullyPayment,
  failPayment,
};
