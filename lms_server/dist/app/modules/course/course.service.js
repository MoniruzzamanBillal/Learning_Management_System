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
exports.courseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const review_service_1 = require("../review/review.service");
const user_model_1 = require("../user/user.model");
const course_model_1 = require("./course.model");
// ! for crating a course
const addCourse = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const { instructors } = payload;
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const courseCover = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.courseCover = courseCover;
    }
    yield Promise.all(instructors === null || instructors === void 0 ? void 0 : instructors.map((instructor) => __awaiter(void 0, void 0, void 0, function* () {
        const instructorData = yield user_model_1.userModel.findById(instructor);
        if (!instructorData) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Instructor don't exist !!!");
        }
    })));
    const result = yield course_model_1.courseModel.create(payload);
    return result;
});
// ! for getting all course data
const getAllCourses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category, limit = 10, page = 1 } = query;
    const params = {};
    params.published = true;
    if (category) {
        params.category = category;
    }
    if (searchTerm) {
        params.$or = [
            { name: { $regex: new RegExp(searchTerm, "i") } },
            { detail: { $regex: new RegExp(searchTerm, "i") } },
        ];
    }
    const numaricLimit = Number(limit);
    const numaricPage = Number(page);
    const skip = (numaricPage - 1) * numaricLimit;
    // console.log(params);
    const allCourseData = yield course_model_1.courseModel
        .find(params)
        .populate("instructors", " name   ")
        .limit(numaricLimit)
        .skip(skip)
        .select(" -published -createdAt -__v -description -modules -updatedAt ");
    // console.log(allCourseData);
    const result = yield Promise.all(allCourseData === null || allCourseData === void 0 ? void 0 : allCourseData.map((courseData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const reviewData = yield review_service_1.reviewServices.getAverageReviewOfCourse((_a = courseData === null || courseData === void 0 ? void 0 : courseData._id) === null || _a === void 0 ? void 0 : _a.toString());
        return Object.assign(Object.assign({}, courseData.toObject()), { reviewData });
    })));
    const totalCourses = yield course_model_1.courseModel.countDocuments({ published: true });
    return { data: result, meta: { totalCourses } };
});
// ! for getting all course data ,admin manage course
const getAllCoursesForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.courseModel
        .find()
        .populate("instructors", " name email profilePicture _id ");
    return result;
});
// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.courseModel
        .find()
        .populate("instructors", " name email profilePicture _id ")
        .populate("modules", " -__v -updatedAt -createdAt ");
    return result;
});
// ! for getting instructor assign courses
const getInstructorsAssignCourses = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield course_model_1.courseModel
        .find({ instructors: instructorId })
        .select(" category courseCover name _id published ");
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Instructor don't assigned for any courses  !!!");
    }
    return courseData;
});
// ! for getting single course data
const getSingleCoureData = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.courseModel
        .findOne({ _id: courseId, published: true })
        .populate("instructors", " name  _id ")
        .select(" -published -__v -createdAt ");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    return result;
});
// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.courseModel
        .findOne({ _id: courseId })
        .populate("instructors", " name email profilePicture _id ")
        .populate("modules", "_id course title videos instructor ");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    return result;
});
// ! course detail for instructor
const getCourseDetailForInstructor = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.courseModel
        .findOne({ _id: courseId })
        .select(" _id name category published modules ");
    // .populate("instructors", " name email profilePicture _id ");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    return result;
});
// ! for updating course data
const updateCourseData = (payload, file, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield course_model_1.courseModel.findById(courseId);
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const courseCover = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.courseCover = courseCover;
    }
    const updatedResult = yield course_model_1.courseModel.findByIdAndUpdate(courseId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedResult;
});
// ! for publishing a course
const publishCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield course_model_1.courseModel.findById(courseId);
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    if (courseData === null || courseData === void 0 ? void 0 : courseData.published) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course is already published !!!");
    }
    const result = yield course_model_1.courseModel.findByIdAndUpdate(courseId, { published: true }, { new: true });
    return result;
});
//
exports.courseServices = {
    addCourse,
    getAllCourses,
    getSingleCoureData,
    updateCourseData,
    publishCourse,
    getCourseDetailsForAdmin,
    getAllCoursesForAdmin,
    getInstructorsAssignCourses,
    getAllCoursesWithModules,
    getCourseDetailForInstructor,
};
