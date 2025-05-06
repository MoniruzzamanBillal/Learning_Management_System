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
exports.moduleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const course_model_1 = require("../course/course.model");
const user_model_1 = require("../user/user.model");
const module_model_1 = require("./module.model");
// ! for crating a module
const addModule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { course, instructor } = payload;
    const courseData = yield course_model_1.courseModel.findById(course);
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    if (courseData === null || courseData === void 0 ? void 0 : courseData.published) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course is already published , you can't add new module !!!!");
    }
    const instructorData = yield user_model_1.userModel.findById(instructor);
    if (!instructorData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This instructor don't exist !!!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const moduleData = yield module_model_1.moduleModel.create([payload], { session });
        yield course_model_1.courseModel.findByIdAndUpdate(course, {
            $push: { modules: (_a = moduleData[0]) === null || _a === void 0 ? void 0 : _a._id },
        }, { session });
        yield session.commitTransaction();
        return moduleData;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
// ! for getting all module
const getAllModuleData = () => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield module_model_1.moduleModel
        .find({ isDeleted: false })
        .populate("course", " _id name published ");
    return moduleData;
});
// ! get module data based on course id
const getModuleFromCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield course_model_1.courseModel.findById(courseId);
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    const result = yield module_model_1.moduleModel
        .find({ course: courseId })
        .populate("course", " _id name published ");
    return result;
});
// ! for getting module data
const getModulData = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield module_model_1.moduleModel
        .findById(moduleId)
        .populate("course", "name description category published ")
        .populate("videos", "title  videoUrl")
        .populate("instructor", " name email profilePicture");
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    return moduleData;
});
// ! for updating module
const updateModule = (payload, moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield module_model_1.moduleModel.findById(moduleId);
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    const updatedData = yield module_model_1.moduleModel.findByIdAndUpdate(moduleId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedData;
});
//
exports.moduleServices = {
    addModule,
    getModulData,
    updateModule,
    getAllModuleData,
    getModuleFromCourseId,
};
