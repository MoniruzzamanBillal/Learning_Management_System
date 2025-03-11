import { ZodError } from "zod";
import { TerrorSource, TgenericResponse } from "../interface/error";
import httpStatus from "http-status";

export const handleZodError = (error: ZodError): TgenericResponse => {
  const errorSources: TerrorSource = error?.issues?.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: error?.message,
    errorSources,
  };
};
