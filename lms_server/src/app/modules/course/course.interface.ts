import { ObjectId } from "mongoose";

export type TCourse = {
  name: string;
  description: string;
  price: number;
  category: string;
  instructor?: ObjectId;
  modules?: ObjectId[];
};
