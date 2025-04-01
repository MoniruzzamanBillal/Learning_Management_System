import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

// ! pay for the course
router.post("pay-course", paymentController.payCourse);

//
export const paymentRoute = router;
