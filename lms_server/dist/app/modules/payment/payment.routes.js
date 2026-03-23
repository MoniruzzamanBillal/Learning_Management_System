"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// ! for validating payment
// router.get("/validate-payment", paymentController.validatePayment);
// ! for successfully payment
router.post("/success", payment_controller_1.paymentController.successfullyPayment);
router.post("/fail", payment_controller_1.paymentController.failPayment);
router.post("/cancel", (req, res) => {
    console.log("Payment Canceled:", req.body);
    res.json({ message: "Payment Canceled", data: req.body });
});
//
exports.paymentRoute = router;
