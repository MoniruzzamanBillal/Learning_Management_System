import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { paymentServices } from "./payment.service";

const redirectURL = "http://localhost:5173";

// ! for enrolling into a course
const payCourse = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payed for the course successfully !!!",
    data: "result",
  });
});

// ! for validating payment
const validatePayment = catchAsync(async (req, res) => {
  const result = await paymentServices.validatePayment(req?.query);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment Validate successfully !!!",
    data: result,
  });
});

// ! after successfully payment
const successfullyPayment = catchAsync(async (req, res) => {
  const result = await paymentServices.successfullyPayment(req?.body);

  if (!result) {
    throw new Error("Payment unsuccessful");
  }

  if (result) {
    return res.redirect(`${redirectURL}/courseEnroll-success`);
  }
});

// ! after fail payment
const failPayment = catchAsync(async (req, res) => {
  const result = await paymentServices.failPayment(req?.body);

  if (result) {
    return res.redirect(`${redirectURL}/courseEnroll-fail`);
  }
});

//
export const paymentController = {
  payCourse,
  validatePayment,
  successfullyPayment,
  failPayment,
};
