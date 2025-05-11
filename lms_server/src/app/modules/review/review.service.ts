import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseEnrollmentModel } from "../CourseEnrollment/CourseEnrollment.model";
import { TReview } from "./review.interface";
import { reviewModel } from "./review.model";

// ! for adding a review
const addReview = async (payload: TReview) => {
  const courseEnrolledCompletedData = await courseEnrollmentModel.findOne({
    user: payload?.userId,
    course: payload?.courseId,
    isDeleted: false,
    completed: true,
  });

  if (!courseEnrolledCompletedData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You did not complete this course !!!"
    );
  }

  if (courseEnrolledCompletedData?.isReviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already reivewed this course !!!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // * for creating review data
    await reviewModel.create([payload], { session });

    // * for updating course enrollment isReview Column
    await courseEnrollmentModel.findOneAndUpdate(
      {
        user: payload?.userId,
        course: payload?.courseId,
        isDeleted: false,
        completed: true,
      },
      { isReviewed: true },
      { new: true, session }
    );

    session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.error("Error during review  the course : ", error);
    throw new Error("Failed to review the course!!");
  }

  //
};

// ! for updating review
const updateReview = async (payload: {
  reviewId: string;
  comment: string;
  rating: number;
}) => {
  const { reviewId, comment, rating } = payload;

  const updateResult = await reviewModel.findByIdAndUpdate(
    reviewId,
    { comment, rating },
    { new: true }
  );

  return updateResult;
};

// ! check review eligibility
const checkReviewEligibility = async (courseId: string, userId: string) => {
  const result = await courseEnrollmentModel.findOne({
    user: userId,
    course: courseId,
    completed: true,
    isReviewed: false,
  });

  return result;
};

// ! for getting course review
const getCourseReview = async (courseId: string) => {
  const result = await reviewModel.find({ courseId: courseId });

  return result;
};

//
export const reviewServices = {
  addReview,
  updateReview,
  getCourseReview,
  checkReviewEligibility,
};
