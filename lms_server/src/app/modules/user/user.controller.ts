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

// ! for getting logged in user data
const getLoggedInUser = catchAsync(async (req, res) => {
  const result = await userServices.getLoggedInUser(req.user?.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User data retirved successfully!!!",
    data: result,
  });
});

// ! for getting user based on user id
const getSpecificUser = catchAsync(async (req, res) => {
  const result = await userServices.getSpecificUser(req.params?.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User data retirved successfully!!!",
    data: result,
  });
});

// ! for updating a user
const updateUser = catchAsync(async (req, res) => {
  const result = await userServices.updateUser(
    req?.body,
    req?.file,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully ",
    data: result,
  });
});

//
export const userController = {
  getAllInstructor,
  changePassword,
  getLoggedInUser,
  getSpecificUser,
  updateUser,
};
