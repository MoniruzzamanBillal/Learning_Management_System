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
exports.reviewServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const CourseEnrollment_model_1 = require("../CourseEnrollment/CourseEnrollment.model");
const review_model_1 = require("./review.model");
// ! for adding a review
const addReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEnrolledCompletedData = yield CourseEnrollment_model_1.courseEnrollmentModel.findOne({
        user: payload === null || payload === void 0 ? void 0 : payload.userId,
        course: payload === null || payload === void 0 ? void 0 : payload.courseId,
        isDeleted: false,
        completed: true,
    });
    if (!courseEnrolledCompletedData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You did not complete this course !!!");
    }
    if (courseEnrolledCompletedData === null || courseEnrolledCompletedData === void 0 ? void 0 : courseEnrolledCompletedData.isReviewed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already reivewed this course !!!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // * for creating review data
        yield review_model_1.reviewModel.create([payload], { session });
        // * for updating course enrollment isReview Column
        yield CourseEnrollment_model_1.courseEnrollmentModel.findOneAndUpdate({
            user: payload === null || payload === void 0 ? void 0 : payload.userId,
            course: payload === null || payload === void 0 ? void 0 : payload.courseId,
            isDeleted: false,
            completed: true,
        }, { isReviewed: true }, { new: true, session });
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        console.error("Error during review  the course : ", error);
        throw new Error("Failed to review the course!!");
    }
    //
});
// ! for updating review
const updateReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, comment, rating } = payload;
    const updateResult = yield review_model_1.reviewModel.findByIdAndUpdate(reviewId, { comment, rating }, { new: true });
    return updateResult;
});
// ! check review eligibility
const checkReviewEligibility = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield CourseEnrollment_model_1.courseEnrollmentModel.findOne({
        user: userId,
        course: courseId,
        completed: true,
        isReviewed: false,
    });
    return result;
});
// ! for getting course review
const getCourseReview = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.reviewModel
        .find({ courseId: courseId })
        .populate("userId", "_id name profilePicture ")
        .select(" _id  rating  comment   createdAt ");
    return result;
});
//
exports.reviewServices = {
    addReview,
    updateReview,
    getCourseReview,
    checkReviewEligibility,
};
