import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseEnrollmentModel } from "../CourseEnrollment/CourseEnrollment.model";
import { userModel } from "../user/user.model";
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
      "You did not complete this course !!!",
    );
  }

  if (courseEnrolledCompletedData?.isReviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already reivewed this course !!!",
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
      { new: true, session },
    );

    await session.commitTransaction();
    await session.endSession();
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
    { new: true },
  );

  return updateResult;
};

// ! check review eligibility
const checkReviewEligibility = async (
  courseId: string,
  userId: string | undefined,
) => {
  const userData = await userModel.findById(userId);

  if (!userData) {
    return false;
  }

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
  const result = await reviewModel
    .find({ courseId: courseId })
    .populate("userId", "_id name profilePicture ")
    .select(" _id  rating  comment   createdAt ");

  return result;
};

// ! for getting average review
const getAverageReviewOfCourse = async (courseId: string) => {
  const result = await reviewModel.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$courseId",
        averageRating: {
          $avg: "$rating",
        },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result[0];
};

// ! for admin: listing all reviews across all courses
const getAllReviewsForAdmin = async () => {
  const result = await reviewModel
    .find()
    .populate("userId", "_id name")
    .populate("courseId", "_id name")
    .sort({ createdAt: -1 });

  return result;
};

// ! for admin: soft-deleting a review
const deleteReview = async (reviewId: string) => {
  const review = await reviewModel.findById(reviewId);

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found !!!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await reviewModel.findByIdAndUpdate(
      reviewId,
      { isDeleted: true },
      { session },
    );

    await courseEnrollmentModel.findOneAndUpdate(
      {
        user: review.userId,
        course: review.courseId,
        isDeleted: false,
      },
      { isReviewed: false },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error during deleting the review : ", error);
    throw new Error("Failed to delete the review!!");
  }

  return review;
};

//
export const reviewServices = {
  addReview,
  updateReview,
  getCourseReview,
  checkReviewEligibility,
  getAverageReviewOfCourse,
  getAllReviewsForAdmin,
  deleteReview,
};
