import mongoose, { Schema } from "mongoose";
import { Torder } from "./test.interface";

const orderSchema = new Schema<Torder>({
  email: {
    type: String,
    required: [true, "Email is required!!"],
  },
  productId: {
    type: String,
    required: [true, "productId is required!!"],
  },
  price: {
    type: Number,
    required: [true, "product price is required!!"],
  },
  quantity: {
    type: Number,
    required: [true, "product quantity is required!!"],
  },
});

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
