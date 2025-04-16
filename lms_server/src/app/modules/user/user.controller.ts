import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.service";

const getAllInstructor = catchAsync(async (req, res) => {
  const result = await userServices.getAllInstructor();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "All instructor retrived successfully !!!",
    data: result,
  });
});

//
export const userController = {
  getAllInstructor,
};
