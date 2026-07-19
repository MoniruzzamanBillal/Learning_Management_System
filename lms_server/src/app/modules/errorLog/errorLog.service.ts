import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { TErrorLog } from "./errorLog.interface";
import { errorLogModel } from "./errorLog.model";

// ! for storing an error, called internally from globalErrorHandler only
const logError = async (payload: TErrorLog) => {
  try {
    await errorLogModel.create(payload);
  } catch (error) {
    console.error("Failed to persist error log:", error);
  }
};

// ! for getting all error logs (admin only)
const getAllErrorLogs = async () => {
  const result = await errorLogModel
    .find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate("userId", "name email");

  return result;
};

// ! for getting a single error log's detail (admin only)
const getErrorLogById = async (id: string) => {
  const result = await errorLogModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "This error log doesn't exist!!!");
  }

  return result;
};

export const errorLogServices = {
  logError,
  getAllErrorLogs,
  getErrorLogById,
};
