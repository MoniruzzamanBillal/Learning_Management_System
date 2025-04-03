import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

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
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment Validate successfully !!!",
    data: "result",
  });
});

//
export const paymentController = {
  payCourse,
  validatePayment,
};
