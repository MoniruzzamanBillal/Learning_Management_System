import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { errorLogServices } from "./errorLog.service";

// ! for getting all error logs
const getAllErrorLogs = catchAsync(async (req, res) => {
  const result = await errorLogServices.getAllErrorLogs();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error logs retrived successfully !!!",
    data: result,
  });
});

// ! for getting a single error log
const getErrorLogById = catchAsync(async (req, res) => {
  const result = await errorLogServices.getErrorLogById(req?.params?.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error log retrived successfully !!!",
    data: result,
  });
});

export const errorLogController = {
  getAllErrorLogs,
  getErrorLogById,
};
