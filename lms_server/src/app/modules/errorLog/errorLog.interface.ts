import { ErrorLog } from "../../../generated/prisma/client";
import { TerrorSource } from "../../interface/error";

export type TErrorLog = ErrorLog;

export type TCreateErrorLog = {
  message: string;
  statusCode: number;
  errorSources: TerrorSource;
  stack?: string;
  method: string;
  path: string;
  ip?: string;
  userId?: string;
  userRole?: string;
};
