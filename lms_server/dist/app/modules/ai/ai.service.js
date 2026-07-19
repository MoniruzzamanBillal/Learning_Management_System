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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const openRouterClient_1 = require("../../util/openRouterClient");
const course_model_1 = require("../course/course.model");
const CourseEnrollment_service_1 = require("../CourseEnrollment/CourseEnrollment.service");
const module_model_1 = require("../courseModule/module.model");
const review_service_1 = require("../review/review.service");
const VideoProgress_model_1 = require("../VideoProgress/VideoProgress.model");
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
// ! for getting a chat reply from the in-course study assistant, grounded in course structure + this user's progress
const getStudyAssistantReply = (courseId, userId, messages) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.courseModel
        .findById(courseId)
        .select("name description");
    if (!course) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course don't exist !!!");
    }
    const modules = yield module_model_1.moduleModel
        .find({ course: courseId, isDeleted: false })
        .populate({
        path: "videos",
        model: "Video",
        select: "_id title videoOrder",
    })
        .select("_id title videos");
    const outline = modules.map((moduleData) => {
        const videos = moduleData.videos
            .slice()
            .sort((a, b) => a.videoOrder - b.videoOrder);
        return {
            title: moduleData.title,
            videoTitles: videos.map((video) => video.title),
        };
    });
    const overallProgress = yield CourseEnrollment_service_1.courseEnrollmentService.courseProgressPercentage(courseId, userId);
    const progressRecords = yield VideoProgress_model_1.videoProgressModel
        .find({ course: courseId, user: userId })
        .populate("video", "_id title videoOrder")
        .select("videoStatus");
    const videoBreakdown = progressRecords
        .map((record) => {
        const video = record.video;
        return {
            title: video === null || video === void 0 ? void 0 : video.title,
            videoOrder: video === null || video === void 0 ? void 0 : video.videoOrder,
            status: record.videoStatus,
        };
    })
        .sort((a, b) => a.videoOrder - b.videoOrder)
        .map(({ title, status }) => `${title}: ${status}`);
    const systemPrompt = `You are a study assistant for the course "${course.name}".

Course description: ${course.description}

Course outline (in order):
${outline
        .map((module, index) => `${index + 1}. ${module.title}\n${module.videoTitles
        .map((title, videoIndex) => `   ${videoIndex + 1}. ${title}`)
        .join("\n")}`)
        .join("\n")}

This student's overall progress: ${overallProgress}%

This student's per-video status:
${videoBreakdown.join("\n")}

Rules:
- Answer only using the course outline and progress data above.
- You do NOT have access to what is actually said inside any video (no transcripts/captions are stored). If asked what a video says or covers in detail beyond its title, honestly say you don't have access to the video content instead of making something up.
- Keep answers concise and grounded in the real course structure and this student's real progress.`;
    const systemMessage = {
        role: "system",
        content: systemPrompt,
    };
    const reply = yield (0, openRouterClient_1.askOpenRouter)([systemMessage, ...messages]);
    return { reply };
});
exports.aiServices = {
    getReviewSummary,
    getCourseAdvice,
    getStudyAssistantReply,
};
