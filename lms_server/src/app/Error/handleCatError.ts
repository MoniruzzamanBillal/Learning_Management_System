import mongoose from "mongoose";
import { TerrorSource, TgenericResponse } from "../interface/error";
import httpStatus from "http-status";

export const handleCastError = (
  error: mongoose.Error.CastError
): TgenericResponse => {
  const errorSources: TerrorSource = [
    {
      path: error?.path,
      message: error?.message,
    },
  ];

  const statusCode = httpStatus.NOT_FOUND;

  return {
    statusCode,
    message: "Invalid Id ",
    errorSources,
  };
};
