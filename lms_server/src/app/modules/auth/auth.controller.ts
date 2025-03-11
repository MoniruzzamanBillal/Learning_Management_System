import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { authServices } from "./auth.service";
import httpStatus from "http-status";

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

//
export const authControllers = {
  createUser,
};
