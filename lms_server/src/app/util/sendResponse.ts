import { Response } from "express";

type Tresponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: Tresponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    token: data.token,
  });
};

export default sendResponse;
