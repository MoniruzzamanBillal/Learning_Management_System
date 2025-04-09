import { ObjectId } from "mongoose";

export type TCourse = {
  name: string;
  description: string;
  price: number;
  category: string;
  published: boolean;
  instructors: ObjectId[];
  modules?: ObjectId[];
};
