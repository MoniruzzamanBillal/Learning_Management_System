import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

// ! for validating payment
router.get("/validate-payment", paymentController.validatePayment);

// ! pay for the course
router.post("pay-course", paymentController.payCourse);

// ! for successfully payment
router.post("/success", paymentController.successfullyPayment);

router.post("/fail", (req, res) => {
  console.log("Payment Failed:", req.body);
  res.json({ message: "Payment Failed", data: req.body });
});

router.post("/cancel", (req, res) => {
  console.log("Payment Canceled:", req.body);
  res.json({ message: "Payment Canceled", data: req.body });
});

//
export const paymentRoute = router;
