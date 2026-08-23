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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewServices = void 0;
const client_1 = require("../../../generated/prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
// ! for adding a review
const addReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEnrolledCompletedData = yield prisma_1.default.courseEnrollment.findFirst({
        where: {
            userId: payload === null || payload === void 0 ? void 0 : payload.userId,
            courseId: payload === null || payload === void 0 ? void 0 : payload.courseId,
            isDeleted: false,
            completed: true,
        },
    });
    if (!courseEnrolledCompletedData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You did not complete this course !!!");
    }
    if (courseEnrolledCompletedData === null || courseEnrolledCompletedData === void 0 ? void 0 : courseEnrolledCompletedData.isReviewed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already reivewed this course !!!");
    }
    try {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // * for creating review data
            yield tx.review.create({
                data: {
                    userId: payload.userId,
                    courseId: payload.courseId,
                    rating: payload.rating,
                    comment: payload.comment,
                },
            });
            // * for updating course enrollment isReview Column
            yield tx.courseEnrollment.update({
                where: { id: courseEnrolledCompletedData.id },
                data: { isReviewed: true },
            });
        }));
    }
    catch (error) {
        // Friendly mapped error for the new @@unique([userId, courseId])
        // constraint (spec decision #3) — not present in the old Mongo schema,
        // so this couldn't happen before.
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already reivewed this course !!!");
        }
        throw error;
    }
    //
});
// ! for updating review
const updateReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, comment, rating } = payload;
    const existingReview = yield prisma_1.default.review.findFirst({
        where: { id: reviewId, isDeleted: false },
    });
    if (!existingReview) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found !!!");
    }
    const updateResult = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: { comment, rating },
    });
    return updateResult;
});
// ! check review eligibility
const checkReviewEligibility = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = userId
        ? yield prisma_1.default.user.findFirst({ where: { id: userId, isDeleted: false } })
        : null;
    if (!userData) {
        return false;
    }
    const result = yield prisma_1.default.courseEnrollment.findFirst({
        where: { userId, courseId, completed: true, isReviewed: false },
    });
    return result;
});
// ! for getting course review
const getCourseReview = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
        where: { courseId, isDeleted: false },
        select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, name: true, profilePicture: true } },
        },
    });
    return result.map((_a) => {
        var { user } = _a, rest = __rest(_a, ["user"]);
        return (Object.assign(Object.assign({}, rest), { userId: user }));
    });
});
// ! for getting average review
const getAverageReviewOfCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.aggregate({
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
});
// ! for admin: listing all reviews across all courses
const getAllReviewsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, name: true } },
            course: { select: { id: true, name: true } },
        },
    });
    return result.map((_a) => {
        var { user, course } = _a, rest = __rest(_a, ["user", "course"]);
        return (Object.assign(Object.assign({}, rest), { userId: user, courseId: course }));
    });
});
// ! for admin: soft-deleting a review
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findFirst({
        where: { id: reviewId, isDeleted: false },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found !!!");
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.review.update({
            where: { id: reviewId },
            data: { isDeleted: true },
        });
        const enrollment = yield tx.courseEnrollment.findFirst({
            where: {
                userId: review.userId,
                courseId: review.courseId,
                isDeleted: false,
            },
        });
        if (enrollment) {
            yield tx.courseEnrollment.update({
                where: { id: enrollment.id },
                data: { isReviewed: false },
            });
        }
    }));
    return review;
});
//
exports.reviewServices = {
    addReview,
    updateReview,
    getCourseReview,
    checkReviewEligibility,
    getAverageReviewOfCourse,
    getAllReviewsForAdmin,
    deleteReview,
};
