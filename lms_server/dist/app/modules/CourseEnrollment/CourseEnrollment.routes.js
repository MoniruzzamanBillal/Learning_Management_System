"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseEnrollmentRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const ValidateCourseAccess_1 = __importDefault(require("../../middleware/ValidateCourseAccess"));
const user_constants_1 = require("../user/user.constants");
const CourseEnrollment_controller_1 = require("./CourseEnrollment.controller");
const router = (0, express_1.Router)();
// ! for getting enrollment course info
router.get("/enrollment-data", (0, authCheck_1.default)(user_constants_1.UserRole.admin), CourseEnrollment_controller_1.CourseEnrollmentController.enrollmentsPerCourse);
// ! for enrolling into a course
router.post("/enroll-course", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.enrollInCourse);
// ! for getting all user's enrolled course
router.get("/user-all-enrolled-couses", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.getAllUserEnrolledCourse);
// ! for getting user single enrolled course data
router.get("/my-enrolled-course/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, CourseEnrollment_controller_1.CourseEnrollmentController.getMyCourseEnrollData);
// ! for checking user enrolled a coure or not
router.get("/check-user-enrolled/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.checkUserEnrolledInCourse);
// ! for getting module data for enrolled course
router.get("/my-enrolled-course-modules/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, CourseEnrollment_controller_1.CourseEnrollmentController.getModuleDataEnrlledCourse);
// ! for getting video for enrolled course
router.get("/my-enrolled-course-videos/:videoId", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.getVideoDataEnrlledCourse);
// ! for getting course progress percentage
router.get("/my-course-progress/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.courseProgressPercentage);
// ! based on module id , find video data for enrolled user
router.get("/module-videos/:moduleId", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.getUserEnrolledModuleVideos);
//  ! for marking course as complete
router.patch("/complete-my-course/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), CourseEnrollment_controller_1.CourseEnrollmentController.markCompleteCourse);
//
exports.courseEnrollmentRouter = router;
