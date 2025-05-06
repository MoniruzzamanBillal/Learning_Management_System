"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const user_constants_1 = require("../user/user.constants");
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
const router = (0, express_1.Router)();
// ! for getting all course data
router.get("/all-courses", course_controller_1.courseController.getAllCourses);
// ! for getting all course data for admin
router.get("/admin-all-courses", 
// authCheck(UserRole.admin),
course_controller_1.courseController.getAllCoursesForAdmin);
// ! for getting all course data for admin and instructor
router.get("/all-courses-modules", 
// authCheck(UserRole.admin, UserRole?.instructor),
course_controller_1.courseController.getAllCoursesWithModules);
// ! for adding new course
router.post("/add-course", (0, authCheck_1.default)(user_constants_1.UserRole.admin), SendImageCloudinary_1.upload.single("courseCover"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, validateRequest_1.default)(course_validation_1.courseValidations.crateCourseValidationSchema), course_controller_1.courseController.createCourse);
// ! for getting single course data
router.get("/course-detail/:id", course_controller_1.courseController.getSingleCourse);
// ! for getting single course data , for admin
router.get("/admin-course-detail/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.admin), course_controller_1.courseController.getCourseDetailsForAdmin);
// ! for getting single course data , for instructor
router.get("/instructor-course-detail/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), course_controller_1.courseController.getCourseDetailForInstructor);
// ! for getting instructor assigned courses
router.get("/instructor-courses/:instructorId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), course_controller_1.courseController.getInstructorsAssignCourses);
// ! for updating a course
router.patch("/update-course/:id", SendImageCloudinary_1.upload.single("courseCover"), (0, authCheck_1.default)(user_constants_1.UserRole.admin), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, validateRequest_1.default)(course_validation_1.courseValidations.updateCourseValidationSchema), course_controller_1.courseController.updateCourse);
// ! for publishing a course
router.patch("/publish-course/:id", (0, authCheck_1.default)(user_constants_1.UserRole.admin), course_controller_1.courseController.publishCourse);
//
exports.courseRouter = router;
