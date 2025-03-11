import { AnyZodObject } from "zod";
import catchAsync from "../util/catchAsync";
import { NextFunction, Request, Response } from "express";

const validateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await Schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};
export default validateRequest;
