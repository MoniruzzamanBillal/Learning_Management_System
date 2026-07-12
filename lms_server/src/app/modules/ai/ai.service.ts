import { askOpenRouter, TChatMessage } from "../../util/openRouterClient";
import { courseModel } from "../course/course.model";
import { reviewServices } from "../review/review.service";
import {
  TCourseAdvisorRecommendation,
  TCourseAdvisorResponse,
  TReviewSummaryResponse,
} from "./ai.interface";

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

// ! for getting AI course recommendations based on a user's learning goal
const getCourseAdvice = async (
  query: string,
): Promise<TCourseAdvisorResponse> => {
  const courses = await courseModel
    .find({ published: true })
    .select("_id name description category price")
    .limit(50)
    .lean();

  if (!courses.length) {
    return { recommendations: [] };
  }

  const courseList = courses.map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    description: c.description,
    category: c.category,
    price: c.price,
  }));

  const systemPrompt = `You are a helpful course advisor. A student will describe what they want to learn, and you must recommend at most 3 courses from the provided list.

Rules:
- Only recommend courses from the provided list. Never invent course IDs.
- Return JSON in this exact format: { "recommendations": [{ "courseId": "...", "reason": "..." }] }
- Include at most 3 recommendations.
- If the query is off-topic or no courses match, return { "recommendations": [] }.
- The "reason" should be one concise sentence explaining why this course fits the student's goal.`;

  const userPrompt = `Student's goal: "${query}"

Available courses:
${JSON.stringify(courseList, null, 2)}`;

  const messages: TChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  let parsed: { recommendations?: { courseId: string; reason: string }[] } = {
    recommendations: [],
  };

  try {
    const raw = await askOpenRouter(messages, { jsonMode: true });
    parsed = JSON.parse(raw);
  } catch {
    return { recommendations: [] };
  }

  const validCourseIds = new Set(courseList.map((c) => c._id));

  const filtered = (parsed.recommendations ?? [])
    .filter((r) => validCourseIds.has(r.courseId))
    .slice(0, 3);

  const recommendations: TCourseAdvisorRecommendation[] = filtered.map((r) => {
    const course = courseList.find((c) => c._id === r.courseId)!;
    return {
      courseId: course._id,
      reason: r.reason,
      name: course.name,
      category: course.category,
      price: course.price,
    };
  });

  return { recommendations };
};

export const aiServices = {
  getReviewSummary,
  getCourseAdvice,
};
