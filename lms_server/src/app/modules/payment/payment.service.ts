import axios from "axios";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { paymentModel } from "./payment.model";
import { PAYMENTSTATUS } from "./payment.constant";

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
  // VALID
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

//
export const paymentServices = { validatePayment, successfullyPayment };
