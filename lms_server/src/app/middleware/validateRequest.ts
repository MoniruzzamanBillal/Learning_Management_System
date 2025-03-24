import { AnyZodObject } from "zod";
import catchAsync from "../util/catchAsync";

const validateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await Schema.parseAsync(req.body);
    next();
  });
};
export default validateRequest;
