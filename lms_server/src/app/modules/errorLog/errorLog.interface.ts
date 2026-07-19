import { ObjectId } from "mongoose";
import { TerrorSource } from "../../interface/error";

export type TErrorLog = {
  message: string;
  statusCode: number;
  errorSources: TerrorSource;
  stack?: string;
  method: string;
  path: string;
  ip?: string;
  userId?: ObjectId | string;
  userRole?: string;
};
