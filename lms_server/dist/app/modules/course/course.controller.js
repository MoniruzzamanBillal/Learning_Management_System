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
exports.courseController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const course_service_1 = require("./course.service");
// ! for crating a course
const createCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.addCourse(req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course added successfully !!!",
        data: result,
    });
}));
// ! for getting all course data
const getAllCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.getAllCourses(req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data retrives successfully !!!",
        data: result,
    });
}));
// ! for getting all course data for admin
const getAllCoursesForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.getAllCoursesForAdmin();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data retrives successfully !!!",
        data: result,
    });
}));
// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.courseServices.getAllCoursesWithModules();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data retrives successfully !!!",
        data: result,
    });
}));
// ! for getting single course
const getSingleCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield course_service_1.courseServices.getSingleCoureData((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data retrives successfully !!!",
        data: result,
    });
}));
// ! for getting instructor assign courses
const getInstructorsAssignCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield course_service_1.courseServices.getInstructorsAssignCourses((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.instructorId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Instructor assigned Course data retrives successfully !!!",
        data: result,
    });
}));
// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield course_service_1.courseServices.getCourseDetailsForAdmin((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data retrives successfully !!!",
        data: result,
    });
}));
// ! get course detail for instructor
const getCourseDetailForInstructor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield course_service_1.courseServices.getCourseDetailForInstructor((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data retrives successfully !!!",
        data: result,
    });
}));
// ! for updating a course
const updateCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield course_service_1.courseServices.updateCourseData(req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.file, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course data updated successfully !!!",
        data: result,
    });
}));
// ! for publishing a course
const publishCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield course_service_1.courseServices.publishCourse((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course published successfully !!!",
        data: result,
    });
}));
//
exports.courseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    publishCourse,
    getCourseDetailsForAdmin,
    getAllCoursesForAdmin,
    getInstructorsAssignCourses,
    getAllCoursesWithModules,
    getCourseDetailForInstructor,
};
