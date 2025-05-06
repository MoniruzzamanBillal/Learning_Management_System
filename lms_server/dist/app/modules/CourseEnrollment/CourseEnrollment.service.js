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
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const course_model_1 = require("../course/course.model");
const module_model_1 = require("../courseModule/module.model");
const payment_model_1 = require("../payment/payment.model");
const SSL_service_1 = require("../SSL/SSL.service");
const user_model_1 = require("../user/user.model");
const video_constants_1 = require("../VideoModule/video.constants");
const video_model_1 = require("../VideoModule/video.model");
const VideoProgress_constants_1 = require("../VideoProgress/VideoProgress.constants");
const VideoProgress_model_1 = require("../VideoProgress/VideoProgress.model");
const CourseEnrollment_model_1 = require("./CourseEnrollment.model");
// ! for enrolling into a course
const enrollInCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { user, course } = payload;
    const userData = yield user_model_1.userModel.findById(user);
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user don't exist !!!");
    }
    const courseData = yield course_model_1.courseModel.findById(course);
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course don't exist !!!");
    }
    if (!(courseData === null || courseData === void 0 ? void 0 : courseData.published)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course is not published yet!!!");
    }
    const previousEnrolledData = yield CourseEnrollment_model_1.courseEnrollmentModel.findOne({
        user,
        course,
        isDeleted: false,
    });
    if (previousEnrolledData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This course is already enrolled by the user !!!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const transactionId = `TXN-${Date.now()}`;
        const paymentData = {
            user,
            course,
            amount: courseData === null || courseData === void 0 ? void 0 : courseData.price,
            transactionId,
        };
        // * create payment record
        const paymentRecord = yield payment_model_1.paymentModel.create([paymentData], { session });
        const courseEnrollmentData = {
            user,
            course,
            Payment: (_a = paymentRecord[0]) === null || _a === void 0 ? void 0 : _a._id,
        };
        // * create course enrollment record
        const courseEnrollmentRecord = yield CourseEnrollment_model_1.courseEnrollmentModel.create([courseEnrollmentData], { session });
        // * update payment record
        yield payment_model_1.paymentModel.findByIdAndUpdate((_b = paymentRecord[0]) === null || _b === void 0 ? void 0 : _b._id, { CourseEnrollment: (_c = courseEnrollmentRecord[0]) === null || _c === void 0 ? void 0 : _c._id }, { session });
        const modules = yield module_model_1.moduleModel
            .find({ isDeleted: false, course })
            .select("_id");
        const moduleIds = modules.map((m) => { var _a; return (_a = m === null || m === void 0 ? void 0 : m._id) === null || _a === void 0 ? void 0 : _a.toString(); });
        // * create video progress data
        const videoDatas = yield video_model_1.videoModel
            .find({ isDeleted: false, module: { $in: moduleIds } })
            .sort({ videoOrder: 1 });
        // console.log(videoDatas);
        const videoProgressData = videoDatas === null || videoDatas === void 0 ? void 0 : videoDatas.map((video) => {
            var _a, _b;
            return ({
                user,
                course,
                module: (_a = video === null || video === void 0 ? void 0 : video.module) === null || _a === void 0 ? void 0 : _a._id.toString(),
                video: (_b = video === null || video === void 0 ? void 0 : video._id) === null || _b === void 0 ? void 0 : _b.toString(),
                videoStatus: (video === null || video === void 0 ? void 0 : video.videoOrder) === 0
                    ? VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.unlocked
                    : VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.locked,
            });
        });
        // console.log(videoProgressData);
        // * create video progress record
        yield VideoProgress_model_1.videoProgressModel.insertMany(videoProgressData, { session });
        const paymentRequestData = {
            price: courseData === null || courseData === void 0 ? void 0 : courseData.price,
            transactionId,
            productName: courseData === null || courseData === void 0 ? void 0 : courseData.name,
            productCategory: courseData === null || courseData === void 0 ? void 0 : courseData.category,
            userName: userData === null || userData === void 0 ? void 0 : userData.name,
            userEmail: userData === null || userData === void 0 ? void 0 : userData.email,
        };
        const result = yield SSL_service_1.sslServices.initPayment(paymentRequestData);
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        console.error("Error during enrolling into the course : ", error);
        throw new Error("Failed to enroll into the course!!");
    }
    //
});
// ! for getting all user's enrolled course
const getAllUserEnrolledCourse = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEnrolledData = yield CourseEnrollment_model_1.courseEnrollmentModel
        .find({
        user: userId,
        isDeleted: false,
    })
        .populate("course", " _id name category courseCover ")
        .select(" -Payment -isDeleted -createdAt -updatedAt -__v ");
    const progressResult = yield Promise.all(courseEnrolledData.map((enrollmentData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const progressData = yield courseProgressPercentage((_a = enrollmentData === null || enrollmentData === void 0 ? void 0 : enrollmentData.course) === null || _a === void 0 ? void 0 : _a._id, userId);
        return Object.assign(Object.assign({}, enrollmentData.toObject()), { courseProgress: progressData });
    })));
    return progressResult;
});
// ! get user single enrolled  course data
const getUserEnrolledCourse = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield CourseEnrollment_model_1.courseEnrollmentModel
        .findOne({ user: userId, course: courseId, isDeleted: false })
        .populate({
        path: "course",
        select: " _id name category modules ",
        populate: {
            path: "modules",
            model: "Module",
            select: "_id  title videos",
        },
    })
        .select(" _id user course Payment completed ");
    return result;
});
// ! get module data for enrolled course
const getModuleDataEnrlledCourse = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const previousEnrolledData = yield CourseEnrollment_model_1.courseEnrollmentModel.findOne({
        user: userId,
        course: courseId,
        isDeleted: false,
    });
    if (!previousEnrolledData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have no access of this course content!!!");
    }
    const moduleData = yield module_model_1.moduleModel
        .find({
        course: courseId,
        isDeleted: false,
    })
        .populate({
        path: "videos",
        model: "Video",
        select: " _id module title videoUrl ",
    })
        .select(" _id course title videos ");
    return moduleData;
});
// ! watch video
const watchVideo = (videoId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const videoData = yield video_model_1.videoModel.findOne({
        _id: videoId,
        isDeleted: false,
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    const currentProgressData = yield VideoProgress_model_1.videoProgressModel.findOne({
        user: userId,
        video: videoId,
    });
    // console.log(currentProgressData);
    if (!currentProgressData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Video progress not found for this user!");
    }
    if ((currentProgressData === null || currentProgressData === void 0 ? void 0 : currentProgressData.videoStatus) === (VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.locked)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This video is locked , complete previous video to unlock this video !!!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // * update current video status to watched
        currentProgressData.videoStatus = VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.watched;
        yield currentProgressData.save({ session });
        // * Find next video by order
        const nextVideo = yield video_model_1.videoModel.findOne({
            module: videoData === null || videoData === void 0 ? void 0 : videoData.module,
            videoOrder: (videoData === null || videoData === void 0 ? void 0 : videoData.videoOrder) + 1,
        });
        if (nextVideo) {
            const videoProgressData = yield VideoProgress_model_1.videoProgressModel.findOne({
                user: userId,
                video: (_a = nextVideo === null || nextVideo === void 0 ? void 0 : nextVideo._id) === null || _a === void 0 ? void 0 : _a.toString(),
            });
            // * change the video status if status is locked
            if ((videoProgressData === null || videoProgressData === void 0 ? void 0 : videoProgressData.videoStatus) === (video_constants_1.videoStatus === null || video_constants_1.videoStatus === void 0 ? void 0 : video_constants_1.videoStatus.locked)) {
                yield VideoProgress_model_1.videoProgressModel.findOneAndUpdate({ user: userId, video: (_b = nextVideo === null || nextVideo === void 0 ? void 0 : nextVideo._id) === null || _b === void 0 ? void 0 : _b.toString() }, { videoStatus: VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.unlocked }, { session });
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        return videoData;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        console.log(error);
        throw new Error(error);
    }
});
// ! for tracking course progress
const courseProgressPercentage = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalContent = yield VideoProgress_model_1.videoProgressModel.countDocuments({
        user: userId,
        course: courseId,
    });
    const watchedVideo = yield VideoProgress_model_1.videoProgressModel.countDocuments({
        user: userId,
        course: courseId,
        videoStatus: VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.watched,
    });
    const progressPercentage = Math.round((watchedVideo / totalContent) * 100);
    return progressPercentage;
});
// ! for getting enrolled course info
const enrollmentsPerCourse = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield CourseEnrollment_model_1.courseEnrollmentModel.aggregate([
        {
            $match: {
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: "$course",
                totalEnrollments: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "_id",
                as: "courseInfo",
            },
        },
        {
            $unwind: "$courseInfo",
        },
        {
            $project: {
                _id: 0,
                courseId: "$courseInfo._id",
                courseTitle: "$courseInfo.name",
                totalEnrollments: 1,
            },
        },
    ]);
    //
    return result;
});
// ! based on module id , find video data for enrolled user
const getUserEnrolledModuleVideos = (moduleId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield VideoProgress_model_1.videoProgressModel
        .find({
        module: moduleId,
        user: userId,
    })
        .populate("video", " _id title ")
        .select("  _id  videoStatus ");
    return videoData;
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
};
