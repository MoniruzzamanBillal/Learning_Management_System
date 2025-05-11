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

//
export const reviewController = {
  addReview,
};
