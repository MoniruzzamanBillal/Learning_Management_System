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
exports.courseEnrollmentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const SSL_service_1 = require("../SSL/SSL.service");
const VideoProgress_constants_1 = require("../VideoProgress/VideoProgress.constants");
// ! for enrolling into a course
const enrollInCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, course } = payload;
    const userData = yield prisma_1.default.user.findFirst({
        where: { id: user, isDeleted: false },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user don't exist !!!");
    }
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: course } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course don't exist !!!");
    }
    if (!(courseData === null || courseData === void 0 ? void 0 : courseData.published)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course is not published yet!!!");
    }
    const previousEnrolledData = yield prisma_1.default.courseEnrollment.findFirst({
        where: { userId: user, courseId: course, isDeleted: false },
    });
    if (previousEnrolledData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course is already enrolled by the user !!!");
    }
    const transactionId = `TXN-${Date.now()}`;
    // Per spec decision #4: keep the SSLCommerz HTTP call inside the DB
    // transaction exactly as today — a documented smell, not something to fix
    // as part of this migration.
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.create({
            data: {
                userId: user,
                courseId: course,
                amount: courseData.price,
                transactionId,
            },
        });
        // Payment has no physical FK back to CourseEnrollment (see spec Stage
        // 1.2, Payment model, circular-ref resolution) — CourseEnrollment.paymentId
        // is the only physical FK, set once at creation. No follow-up
        // payment-record update is needed here, unlike the old Mongoose version.
        yield tx.courseEnrollment.create({
            data: {
                userId: user,
                courseId: course,
                paymentId: payment.id,
            },
        });
        const modules = yield tx.module.findMany({
            where: { isDeleted: false, courseId: course },
            select: { id: true },
        });
        const moduleIds = modules.map((m) => m.id);
        const videos = yield tx.video.findMany({
            where: { isDeleted: false, moduleId: { in: moduleIds } },
            orderBy: { videoOrder: "asc" },
        });
        if (videos.length) {
            yield tx.videoProgress.createMany({
                data: videos.map((video) => ({
                    userId: user,
                    courseId: course,
                    moduleId: video.moduleId,
                    videoId: video.id,
                    videoStatus: video.videoOrder === 0
                        ? VideoProgress_constants_1.videoProgressStatus.unlocked
                        : VideoProgress_constants_1.videoProgressStatus.locked,
                })),
            });
        }
        const paymentRequestData = {
            price: Number(courseData.price),
            transactionId,
            productName: courseData.name,
            productCategory: courseData.category,
            userName: userData.name,
            userEmail: userData.email,
        };
        return SSL_service_1.sslServices.initPayment(paymentRequestData);
    }));
    return result;
    //
});
// ! for getting all user's enrolled course
const getAllUserEnrolledCourse = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEnrolledData = yield prisma_1.default.courseEnrollment.findMany({
        where: { userId, isDeleted: false },
        select: {
            id: true,
            userId: true,
            completed: true,
            isReviewed: true,
            course: {
                select: { id: true, name: true, category: true, courseCover: true },
            },
        },
    });
    const progressResult = yield Promise.all(courseEnrolledData.map((enrollmentData) => __awaiter(void 0, void 0, void 0, function* () {
        const progressData = yield courseProgressPercentage(enrollmentData.course.id, userId);
        return Object.assign(Object.assign({}, enrollmentData), { courseProgress: progressData });
    })));
    return progressResult;
});
// ! for checking user enrolled a coure or not
const checkUserEnrolledInCourse = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = userId
        ? yield prisma_1.default.user.findFirst({ where: { id: userId, isDeleted: false } })
        : null;
    if (!userData) {
        return {
            enrolledIncourse: false,
        };
    }
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course don't exist !!!");
    }
    if (!(courseData === null || courseData === void 0 ? void 0 : courseData.published)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course is not published yet!!!");
    }
    const previousEnrolledData = yield prisma_1.default.courseEnrollment.findFirst({
        where: { userId, courseId, isDeleted: false },
    });
    return { enrolledIncourse: !!previousEnrolledData };
});
// ! get user single enrolled  course data
const getUserEnrolledCourse = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.courseEnrollment.findFirst({
        where: { userId, courseId, isDeleted: false },
        select: {
            id: true,
            userId: true,
            courseId: true,
            paymentId: true,
            completed: true,
            course: {
                select: {
                    id: true,
                    name: true,
                    category: true,
                    modules: {
                        select: {
                            id: true,
                            title: true,
                            videos: { select: { id: true } },
                        },
                    },
                },
            },
        },
    });
    if (!result) {
        throw new Error("Enrollment not found");
    }
    const courseProgressData = yield courseProgressPercentage(courseId, userId);
    return Object.assign(Object.assign({}, result), { course: Object.assign(Object.assign({}, result.course), { modules: result.course.modules.map((m) => (Object.assign(Object.assign({}, m), { videos: m.videos.map((v) => v.id) }))) }), courseProgressData });
});
// ! get module data for enrolled course
const getModuleDataEnrlledCourse = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const previousEnrolledData = yield prisma_1.default.courseEnrollment.findFirst({
        where: { userId, courseId, isDeleted: false },
    });
    if (!previousEnrolledData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have no access of this course content!!!");
    }
    const moduleData = yield prisma_1.default.module.findMany({
        where: { courseId, isDeleted: false },
        select: {
            id: true,
            courseId: true,
            title: true,
            videos: {
                where: { isDeleted: false },
                select: { id: true, moduleId: true, title: true, videoUrl: true },
            },
        },
    });
    return moduleData;
});
// ! watch video
const watchVideo = (videoId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield prisma_1.default.video.findFirst({
        where: {
            id: videoId,
            isDeleted: false,
        },
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    const currentProgressData = yield prisma_1.default.videoProgress.findFirst({
        where: { userId, videoId },
    });
    if (!currentProgressData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Video progress not found for this user!");
    }
    if ((currentProgressData === null || currentProgressData === void 0 ? void 0 : currentProgressData.videoStatus) === (VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.locked)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This video is locked , complete previous video to unlock this video !!!");
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // * update current video status to watched
        yield tx.videoProgress.update({
            where: { id: currentProgressData.id },
            data: { videoStatus: VideoProgress_constants_1.videoProgressStatus.watched },
        });
        // * Find next video by order
        const nextVideo = yield tx.video.findFirst({
            where: {
                moduleId: videoData.moduleId,
                videoOrder: videoData.videoOrder + 1,
                isDeleted: false,
            },
        });
        if (nextVideo) {
            const nextProgress = yield tx.videoProgress.findFirst({
                where: { userId, videoId: nextVideo.id },
            });
            // * change the video status if status is locked
            if ((nextProgress === null || nextProgress === void 0 ? void 0 : nextProgress.videoStatus) === (VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.locked)) {
                yield tx.videoProgress.update({
                    where: { id: nextProgress.id },
                    data: { videoStatus: VideoProgress_constants_1.videoProgressStatus.unlocked },
                });
            }
        }
    }));
    return videoData;
});
// ! for tracking course progress
const courseProgressPercentage = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalContent = yield prisma_1.default.videoProgress.count({
        where: { userId, courseId },
    });
    const watchedVideo = yield prisma_1.default.videoProgress.count({
        where: { userId, courseId, videoStatus: VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.watched },
    });
    const progressPercentage = Math.round((watchedVideo / totalContent) * 100);
    return progressPercentage;
});
// ! for getting enrolled course info
const enrollmentsPerCourse = () => __awaiter(void 0, void 0, void 0, function* () {
    const grouped = yield prisma_1.default.courseEnrollment.groupBy({
        by: ["courseId"],
        where: { isDeleted: false },
        _count: { _all: true },
    });
    const courses = yield prisma_1.default.course.findMany({
        where: { id: { in: grouped.map((g) => g.courseId) } },
        select: { id: true, name: true },
    });
    const courseNameById = new Map(courses.map((c) => [c.id, c.name]));
    return grouped.map((g) => ({
        courseId: g.courseId,
        courseTitle: courseNameById.get(g.courseId),
        totalEnrollments: g._count._all,
    }));
    //
});
// ! based on module id , find video data for enrolled user
const getUserEnrolledModuleVideos = (moduleId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield prisma_1.default.videoProgress.findMany({
        where: { moduleId, userId },
        select: {
            id: true,
            videoStatus: true,
            video: { select: { id: true, title: true, videoOrder: true } },
        },
    });
    videoData.sort((a, b) => a.video.videoOrder - b.video.videoOrder);
    return videoData;
});
//  ! for marking course as complete
const markCompleteCourse = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirst({
        where: { id: userId, isDeleted: false },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user don't exist !!!");
    }
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course don't exist !!!");
    }
    if (!(courseData === null || courseData === void 0 ? void 0 : courseData.published)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course is not published yet!!!");
    }
    const previousEnrolledData = yield prisma_1.default.courseEnrollment.findFirst({
        where: { userId, courseId, isDeleted: false },
    });
    if (!previousEnrolledData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You did not enrolled into this course !!!");
    }
    const coursePercentageProgress = yield courseProgressPercentage(courseId, userId);
    if (coursePercentageProgress !== 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You did not complete the full course !!!");
    }
    const result = yield prisma_1.default.courseEnrollment.update({
        where: { id: previousEnrolledData.id },
        data: { completed: true },
    });
    return result;
    //
});
// ! get user's finished course
const usersFinishedCourses = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirst({
        where: { id: userId, isDeleted: false },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user don't exist !!!");
    }
    const result = yield prisma_1.default.courseEnrollment.findMany({
        where: { userId, completed: true, isDeleted: false },
        select: {
            id: true,
            isReviewed: true,
            updatedAt: true,
            user: { select: { id: true, name: true } },
            course: { select: { id: true, name: true, category: true } },
        },
    });
    return result;
});
//
exports.courseEnrollmentService = {
    enrollInCourse,
    getUserEnrolledCourse,
    getModuleDataEnrlledCourse,
    watchVideo,
    courseProgressPercentage,
    enrollmentsPerCourse,
    getAllUserEnrolledCourse,
    getUserEnrolledModuleVideos,
    markCompleteCourse,
    checkUserEnrolledInCourse,
    usersFinishedCourses,
};
