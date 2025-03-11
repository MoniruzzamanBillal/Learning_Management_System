import { Types } from "mongoose";
import { z } from "zod";

export const orderValidationSchema = z.object({
  _id: z.instanceof(Types.ObjectId).optional(),
  __v: z.number().optional(),
  email: z.string().email(),
  productId: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});
