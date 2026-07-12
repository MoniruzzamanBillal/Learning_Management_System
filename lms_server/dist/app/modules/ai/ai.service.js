"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiServices = void 0;
const openRouterClient_1 = require("../../util/openRouterClient");
const course_model_1 = require("../course/course.model");
const review_service_1 = require("../review/review.service");
const NOT_ENOUGH_REVIEWS_MESSAGE = "Not enough reviews yet to summarize.";
// ! for getting (or generating + caching) a course's AI review summary
const getReviewSummary = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const averageData = yield review_service_1.reviewServices.getAverageReviewOfCourse(courseId);
    const totalReviews = (_a = averageData === null || averageData === void 0 ? void 0 : averageData.totalReviews) !== null && _a !== void 0 ? _a : 0;
    const averageRating = (_b = averageData === null || averageData === void 0 ? void 0 : averageData.averageRating) !== null && _b !== void 0 ? _b : null;
    if (!totalReviews || totalReviews < 3) {
        return {
            summary: NOT_ENOUGH_REVIEWS_MESSAGE,
            totalReviews,
            averageRating,
            generated: false,
        };
    }
    const course = yield course_model_1.courseModel
        .findById(courseId)
        .select("aiReviewSummary aiReviewSummaryReviewCount");
    if ((course === null || course === void 0 ? void 0 : course.aiReviewSummary) &&
        (course === null || course === void 0 ? void 0 : course.aiReviewSummaryReviewCount) === totalReviews) {
        return {
            summary: course.aiReviewSummary,
            totalReviews,
            averageRating,
            generated: true,
        };
    }
    const reviews = yield review_service_1.reviewServices.getCourseReview(courseId);
    const reviewText = reviews
        .map((review) => `Rating: ${review.rating}/5 - "${review.comment}"`)
        .join("\n");
    const messages = [
        {
            role: "system",
            content: "You are an assistant that writes a concise, honest pros/cons style summary (2-4 sentences) of student reviews for an online course. Only use information present in the reviews - do not invent details.",
        },
        {
            role: "user",
            content: `Summarize these student reviews:\n${reviewText}`,
        },
    ];
    const summary = yield (0, openRouterClient_1.askOpenRouter)(messages);
    yield course_model_1.courseModel.findByIdAndUpdate(courseId, {
        aiReviewSummary: summary,
        aiReviewSummaryReviewCount: totalReviews,
    });
    return {
        summary,
        totalReviews,
        averageRating,
        generated: true,
    };
});
// ! for getting AI course recommendations based on a user's learning goal
const getCourseAdvice = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const courses = yield course_model_1.courseModel
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
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
    ];
    let parsed = {
        recommendations: [],
    };
    try {
        const raw = yield (0, openRouterClient_1.askOpenRouter)(messages, { jsonMode: true });
        parsed = JSON.parse(raw);
    }
    catch (_b) {
        return { recommendations: [] };
    }
    const validCourseIds = new Set(courseList.map((c) => c._id));
    const filtered = ((_a = parsed.recommendations) !== null && _a !== void 0 ? _a : [])
        .filter((r) => validCourseIds.has(r.courseId))
        .slice(0, 3);
    const recommendations = filtered.map((r) => {
        const course = courseList.find((c) => c._id === r.courseId);
        return {
            courseId: course._id,
            reason: r.reason,
            name: course.name,
            category: course.category,
            price: course.price,
        };
    });
    return { recommendations };
});
exports.aiServices = {
    getReviewSummary,
    getCourseAdvice,
};
