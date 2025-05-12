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
exports.CourseEnrollmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const CourseEnrollment_service_1 = require("./CourseEnrollment.service");
// ! for enrolling into a course
const enrollInCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.enrollInCourse(req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course Enrollment processing!!!",
        data: result,
    });
}));
// ! for getting my enroll course data
const getMyCourseEnrollData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.getUserEnrolledCourse((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Enrolled Course retrived successfully!!!",
        data: result,
    });
}));
// ! for getting all user enrolled course
const getAllUserEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.getAllUserEnrolledCourse((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Users All Enrolled Course retrived successfully!!!",
        data: result,
    });
}));
// ! for getting module data for enrolled course
const getModuleDataEnrlledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.getModuleDataEnrlledCourse((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Enrolled Course retrived successfully!!!",
        data: result,
    });
}));
// ! for getting video data for enrolled course
const getVideoDataEnrlledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.watchVideo((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.videoId, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Video retrived successfully!!!",
        data: result,
    });
}));
// ! for getting course progress percentage
const courseProgressPercentage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.courseProgressPercentage((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.courseId, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course progress result retrived successfully!!!",
        data: result,
    });
}));
// ! for getting enrolled course info
const enrollmentsPerCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.enrollmentsPerCourse();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course Enrollment data retrived successfully!!!",
        data: result,
    });
}));
// ! based on module id , find video data for enrolled user
const getUserEnrolledModuleVideos = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.getUserEnrolledModuleVideos((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.moduleId, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course Enrollment Video data retrived successfully!!!",
        data: result,
    });
}));
//  ! for marking course as complete
const markCompleteCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield CourseEnrollment_service_1.courseEnrollmentService.markCompleteCourse((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.courseId, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course Completed successfully !!!",
        data: result,
    });
}));
//
exports.CourseEnrollmentController = {
    enrollInCourse,
    getMyCourseEnrollData,
    getModuleDataEnrlledCourse,
    getVideoDataEnrlledCourse,
    courseProgressPercentage,
    enrollmentsPerCourse,
    getAllUserEnrolledCourse,
    getUserEnrolledModuleVideos,
    markCompleteCourse,
};
