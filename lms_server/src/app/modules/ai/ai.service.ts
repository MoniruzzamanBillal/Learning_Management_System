import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { askOpenRouter, TChatMessage } from "../../util/openRouterClient";
import prisma from "../../util/prisma";
import { courseEnrollmentService } from "../CourseEnrollment/CourseEnrollment.service";
import { reviewServices } from "../review/review.service";
import {
  TCourseAdvisorRecommendation,
  TCourseAdvisorResponse,
  TStudyAssistantResponse,
  TReviewSummaryResponse,
} from "./ai.interface";

const NOT_ENOUGH_REVIEWS_MESSAGE = "Not enough reviews yet to summarize.";

// ! for getting (or generating + caching) a course's AI review summary
const getReviewSummary = async (
  courseId: string
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

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { aiReviewSummary: true, aiReviewSummaryReviewCount: true },
  });

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

  await prisma.course.update({
    where: { id: courseId },
    data: {
      aiReviewSummary: summary,
      aiReviewSummaryReviewCount: totalReviews,
    },
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
  query: string
): Promise<TCourseAdvisorResponse> => {
  const courses = await prisma.course.findMany({
    where: { published: true },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      price: true,
    },
    take: 50,
  });

  if (!courses.length) {
    return { recommendations: [] };
  }

  const courseList = courses.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    category: c.category,
    price: Number(c.price),
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

  const validCourseIds = new Set(courseList.map((c) => c.id));

  const filtered = (parsed.recommendations ?? [])
    .filter((r) => validCourseIds.has(r.courseId))
    .slice(0, 3);

  const recommendations: TCourseAdvisorRecommendation[] = filtered.map((r) => {
    const course = courseList.find((c) => c.id === r.courseId)!;
    return {
      courseId: course.id,
      reason: r.reason,
      name: course.name,
      category: course.category,
      price: course.price,
    };
  });

  return { recommendations };
};

// ! for getting a chat reply from the in-course study assistant, grounded in course structure + this user's progress
const getStudyAssistantReply = async (
  courseId: string,
  userId: string,
  messages: TChatMessage[]
): Promise<TStudyAssistantResponse> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { name: true, description: true },
  });

  if (!course) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course don't exist !!!");
  }

  const modules = await prisma.module.findMany({
    where: { courseId, isDeleted: false },
    select: {
      title: true,
      videos: {
        where: { isDeleted: false },
        select: { title: true, videoOrder: true },
        orderBy: { videoOrder: "asc" },
      },
    },
  });

  const outline = modules.map((moduleData) => ({
    title: moduleData.title,
    videoTitles: moduleData.videos.map((video) => video.title),
  }));

  const overallProgress = await courseEnrollmentService.courseProgressPercentage(
    courseId,
    userId
  );

  const progressRecords = await prisma.videoProgress.findMany({
    where: { courseId, userId },
    select: {
      videoStatus: true,
      video: { select: { title: true, videoOrder: true } },
    },
  });

  const videoBreakdown = progressRecords
    .map((record) => ({
      title: record.video.title,
      videoOrder: record.video.videoOrder,
      status: record.videoStatus,
    }))
    .sort((a, b) => a.videoOrder - b.videoOrder)
    .map(({ title, status }) => `${title}: ${status}`);

  const systemPrompt = `You are a study assistant for the course "${course.name}".

Course description: ${course.description}

Course outline (in order):
${outline
  .map(
    (module, index) =>
      `${index + 1}. ${module.title}\n${module.videoTitles
        .map((title, videoIndex) => `   ${videoIndex + 1}. ${title}`)
        .join("\n")}`
  )
  .join("\n")}

This student's overall progress: ${overallProgress}%

This student's per-video status:
${videoBreakdown.join("\n")}

Rules:
- Answer only using the course outline and progress data above.
- You do NOT have access to what is actually said inside any video (no transcripts/captions are stored). If asked what a video says or covers in detail beyond its title, honestly say you don't have access to the video content instead of making something up.
- Keep answers concise and grounded in the real course structure and this student's real progress.`;

  const systemMessage: TChatMessage = {
    role: "system",
    content: systemPrompt,
  };

  const reply = await askOpenRouter([systemMessage, ...messages]);

  return { reply };
};

export const aiServices = {
  getReviewSummary,
  getCourseAdvice,
  getStudyAssistantReply,
};
