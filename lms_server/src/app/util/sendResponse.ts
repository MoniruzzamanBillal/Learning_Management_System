import { Response } from "express";

type Tresponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
  token?: string;
};

const sendResponse = <T>(res: Response, data: Tresponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
    token: data.token,
  });
};

export default sendResponse;
