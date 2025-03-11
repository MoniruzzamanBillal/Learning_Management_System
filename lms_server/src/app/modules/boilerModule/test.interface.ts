import { Types } from "mongoose";

export type Torder = {
  _id?: Types.ObjectId;
  __v?: number;
  email: string;
  productId: string;
  price: number;
  quantity: number;
};
