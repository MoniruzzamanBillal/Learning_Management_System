import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";

type TAddReviewPayload = {
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
};

// ! for adding a review
const addReview = async (payload: TAddReviewPayload) => {
  const courseEnrolledCompletedData = await prisma.courseEnrollment.findFirst({
    where: {
      userId: payload?.userId,
      courseId: payload?.courseId,
      isDeleted: false,
      completed: true,
    },
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

  try {
    await prisma.$transaction(async (tx) => {
      // * for creating review data
      await tx.review.create({
        data: {
          userId: payload.userId,
          courseId: payload.courseId,
          rating: payload.rating,
          comment: payload.comment,
        },
      });

      // * for updating course enrollment isReview Column
      await tx.courseEnrollment.update({
        where: { id: courseEnrolledCompletedData.id },
        data: { isReviewed: true },
      });
    });
  } catch (error) {
    // Friendly mapped error for the new @@unique([userId, courseId])
    // constraint (spec decision #3) — not present in the old Mongo schema,
    // so this couldn't happen before.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You already reivewed this course !!!"
      );
    }
    throw error;
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

  const existingReview = await prisma.review.findFirst({
    where: { id: reviewId, isDeleted: false },
  });

  if (!existingReview) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found !!!");
  }

  const updateResult = await prisma.review.update({
    where: { id: reviewId },
    data: { comment, rating },
  });

  return updateResult;
};

// ! check review eligibility
const checkReviewEligibility = async (
  courseId: string,
  userId: string | undefined
) => {
  const userData = userId
    ? await prisma.user.findFirst({ where: { id: userId, isDeleted: false } })
    : null;

  if (!userData) {
    return false;
  }

  const result = await prisma.courseEnrollment.findFirst({
    where: { userId, courseId, completed: true, isReviewed: false },
  });

  return result;
};

// ! for getting course review
const getCourseReview = async (courseId: string) => {
  const result = await prisma.review.findMany({
    where: { courseId, isDeleted: false },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, name: true, profilePicture: true } },
    },
  });

  return result.map(({ user, ...rest }) => ({ ...rest, userId: user }));
};

// ! for getting average review
const getAverageReviewOfCourse = async (courseId: string) => {
  const result = await prisma.review.aggregate({
    where: { courseId, isDeleted: false },
    _avg: { rating: true },
    _count: { _all: true },
  });

  if (!result._count._all) {
    return undefined;
  }

  return {
    _id: courseId,
    averageRating: result._avg.rating,
    totalReviews: result._count._all,
  };
};

// ! for admin: listing all reviews across all courses
const getAllReviewsForAdmin = async () => {
  const result = await prisma.review.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, name: true } },
    },
  });

  return result.map(({ user, course, ...rest }) => ({
    ...rest,
    userId: user,
    courseId: course,
  }));
};

// ! for admin: soft-deleting a review
const deleteReview = async (reviewId: string) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, isDeleted: false },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found !!!");
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });

    const enrollment = await tx.courseEnrollment.findFirst({
      where: {
        userId: review.userId,
        courseId: review.courseId,
        isDeleted: false,
      },
    });

    if (enrollment) {
      await tx.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { isReviewed: false },
      });
    }
  });

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
