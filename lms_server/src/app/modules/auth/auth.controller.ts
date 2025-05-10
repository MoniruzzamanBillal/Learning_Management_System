import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { authServices } from "./auth.service";

// ! for crating a user
const createUser = catchAsync(async (req, res) => {
  const result = await authServices.createUserIntoDB(req?.body, req?.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully ",
    data: result,
  });
});

// ! for creating an instructor
const createInstructor = catchAsync(async (req, res) => {
  const result = await authServices.createInstructor(req?.body, req?.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Instructor added successfully !!!",
    data: result,
  });
});

// ! for login
const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.signInFromDb(req.body);

  const { token, userData } = result;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modifiedUser = userData.toObject() as any;
  delete modifiedUser.password;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully ",
    data: modifiedUser,
    token: token,
  });
});

//
export const authControllers = {
  createUser,
  loginUser,
  createInstructor,
};
