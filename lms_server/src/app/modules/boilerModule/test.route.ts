import express from "express";
import { orderController } from "./test.controller";

const router = express.Router();

router.get("/orders", orderController.getAllOrder);
router.post("/orders", orderController.createOrder);

export const testRouter = router;
