import catchAsync from "../../util/catchAsync";
import { paymentServices } from "./payment.service";

// const redirectURL = "http://localhost:5173";
const redirectURL = "https://devmats.vercel.app";

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
  successfullyPayment,
  failPayment,
};
