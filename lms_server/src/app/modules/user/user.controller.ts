import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
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

// ! for changing password
const changePassword = catchAsync(async (req, res) => {
  const result = await userServices.changePassword(req?.body, req.user?.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "password changed successfully!!!",
    data: result,
  });
});

//
export const userController = {
  getAllInstructor,
  changePassword,
};
