import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { reviewServices } from "./review.service";

// ! for adding a review
const addReview = catchAsync(async (req, res) => {
  const result = await reviewServices.addReview(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review posted successfully !!!",
    data: result,
  });
});

// ! for updating review
const updateReview = catchAsync(async (req, res) => {
  const result = await reviewServices.updateReview(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully !!!",
    data: result,
  });
});

// ! check review eligibility
const checkReviewEligibility = catchAsync(async (req, res) => {
  const result = await reviewServices.checkReviewEligibility(
    req?.params?.courseId,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review eligibility retrived successfully !!!",
    data: result,
  });
});

// ! for getting course review
const getCourseReview = catchAsync(async (req, res) => {
  const result = await reviewServices.getCourseReview(req?.params?.courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrived successfully !!!",
    data: result,
  });
});

//
export const reviewController = {
  addReview,
  updateReview,
  getCourseReview,
  checkReviewEligibility,
};
