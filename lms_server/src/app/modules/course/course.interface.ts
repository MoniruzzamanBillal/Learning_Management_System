import { ObjectId } from "mongoose";

export type TCourse = {
  name: string;
  description: string;
  courseCover: string;
  price: number;
  category: string;
  published: boolean;
  instructors: ObjectId[];
  modules?: ObjectId[];
};
