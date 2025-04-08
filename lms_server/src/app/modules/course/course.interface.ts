import { ObjectId } from "mongoose";

export type TCourse = {
  name: string;
  description: string;
  price: number;
  category: string;
  published: boolean;
  instructor?: ObjectId[];
  modules?: ObjectId[];
};
