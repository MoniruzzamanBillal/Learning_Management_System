import { askOpenRouter, TChatMessage } from "../../util/openRouterClient";
import { courseModel } from "../course/course.model";
import { reviewServices } from "../review/review.service";
import { TReviewSummaryResponse } from "./ai.interface";

const NOT_ENOUGH_REVIEWS_MESSAGE = "Not enough reviews yet to summarize.";

// ! for getting (or generating + caching) a course's AI review summary
const getReviewSummary = async (
  courseId: string,
): Promise<TReviewSummaryResponse> => {
  const averageData = await reviewServices.getAverageReviewOfCourse(courseId);
  const totalReviews = averageData?.totalReviews ?? 0;
  const averageRating = averageData?.averageRating ?? null;

  if (!totalReviews || totalReviews < 3) {
    return {
      summary: NOT_ENOUGH_REVIEWS_MESSAGE,
      totalReviews,
      averageRating,
      generated: false,
    };
  }

  const course = await courseModel
    .findById(courseId)
    .select("aiReviewSummary aiReviewSummaryReviewCount");

  if (
    course?.aiReviewSummary &&
    course?.aiReviewSummaryReviewCount === totalReviews
  ) {
    return {
      summary: course.aiReviewSummary,
      totalReviews,
      averageRating,
      generated: true,
    };
  }

  const reviews = await reviewServices.getCourseReview(courseId);

  const reviewText = reviews
    .map((review) => `Rating: ${review.rating}/5 - "${review.comment}"`)
    .join("\n");

  const messages: TChatMessage[] = [
    {
      role: "system",
      content:
        "You are an assistant that writes a concise, honest pros/cons style summary (2-4 sentences) of student reviews for an online course. Only use information present in the reviews - do not invent details.",
    },
    {
      role: "user",
      content: `Summarize these student reviews:\n${reviewText}`,
    },
  ];

  const summary = await askOpenRouter(messages);

  await courseModel.findByIdAndUpdate(courseId, {
    aiReviewSummary: summary,
    aiReviewSummaryReviewCount: totalReviews,
  });

  return {
    summary,
    totalReviews,
    averageRating,
    generated: true,
  };
};

export const aiServices = {
  getReviewSummary,
};
