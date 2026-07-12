import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { aiServices } from "./ai.service";

// ! for getting a course's AI review summary
const getReviewSummary = catchAsync(async (req, res) => {
  const result = await aiServices.getReviewSummary(
    req?.params?.courseId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review summary retrived successfully !!!",
    data: result,
  });
});

// ! for getting AI course recommendations based on a learning goal
const getCourseAdvice = catchAsync(async (req, res) => {
  const query = req.body.query as string;
  const result = await aiServices.getCourseAdvice(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course recommendations retrieved successfully",
    data: result,
  });
});

export const aiController = {
  getReviewSummary,
  getCourseAdvice,
};
