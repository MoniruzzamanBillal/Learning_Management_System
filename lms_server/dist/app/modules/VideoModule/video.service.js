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
exports.videoServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const CourseEnrollment_model_1 = require("../CourseEnrollment/CourseEnrollment.model");
const module_model_1 = require("../courseModule/module.model");
const user_model_1 = require("../user/user.model");
const videoProgress_functions_1 = require("../VideoProgress/videoProgress.functions");
const video_model_1 = require("./video.model");
// ! for adding a video
const addVideo = (payload, videoUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { module, instructor } = payload;
    const moduleData = yield module_model_1.moduleModel
        .findOne({ _id: module, instructor })
        .populate("course", " _id published");
    const courseInfo = moduleData === null || moduleData === void 0 ? void 0 : moduleData.course;
    const courseId = (_a = courseInfo === null || courseInfo === void 0 ? void 0 : courseInfo._id) === null || _a === void 0 ? void 0 : _a.toString();
    const coursePublished = courseInfo === null || courseInfo === void 0 ? void 0 : courseInfo.published;
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    const instructorData = yield user_model_1.userModel.findById(instructor);
    if (!instructorData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This instructor don't exist !!!");
    }
    const videoCount = yield video_model_1.videoModel.countDocuments({ module });
    payload.videoUrl = videoUrl;
    payload.videoOrder = videoCount;
    const enrolledCourseUsers = yield CourseEnrollment_model_1.courseEnrollmentModel.find({
        course: courseId,
    });
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // * create new video
        const videoData = yield video_model_1.videoModel.create([payload], { session });
        // * update module data with new video reference
        yield module_model_1.moduleModel.findByIdAndUpdate(module, { $push: { videos: (_b = videoData[0]) === null || _b === void 0 ? void 0 : _b._id } }, { session });
        // * insert new video in video progress if course is pulished
        if (coursePublished) {
            yield (0, videoProgress_functions_1.addVideoCoursePublish)({
                enrolledCourseUsers,
                courseId,
                videoId: (_d = (_c = videoData[0]) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString(),
                videoCount,
                moduleId: module === null || module === void 0 ? void 0 : module.toString(),
                session,
            });
        }
        yield session.commitTransaction();
        return videoData;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
    //
});
// ! for getting all the module video
const getAllVideo = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield module_model_1.moduleModel.findById(moduleId);
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    const allVideo = yield video_model_1.videoModel.find({ module: moduleId });
    return allVideo;
});
// ! for getting individual module video
const getSingleVideo = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield video_model_1.videoModel.findOne({
        _id: videoId,
        isDeleted: false,
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    return videoData;
});
// ! for deleting a video
const deleteModuleVideo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId, moduleId } = payload;
    const videoData = yield video_model_1.videoModel.findOne({
        _id: videoId,
        module: moduleId,
        isDeleted: false,
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    const deleteVideo = yield video_model_1.videoModel.findOneAndUpdate({
        _id: videoId,
        module: moduleId,
        isDeleted: false,
    }, { isDeleted: true }, { new: true });
    return deleteVideo;
});
// ! for updating a video
const updateVideo = (payload, videoId, videoUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield video_model_1.videoModel.findById(videoId);
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    if (videoUrl) {
        payload.videoUrl = videoUrl;
    }
    const updatedData = yield video_model_1.videoModel.findByIdAndUpdate(videoId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedData;
});
//
exports.videoServices = {
    addVideo,
    getAllVideo,
    getSingleVideo,
    deleteModuleVideo,
    updateVideo,
};
