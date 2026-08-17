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
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const videoProgress_functions_1 = require("../VideoProgress/videoProgress.functions");
// ! for adding a video
const addVideo = (payload, videoUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { module, instructor } = payload;
    // findFirst, not findUnique: combining the unique `id` lookup with
    // instructorId/isDeleted isn't allowed on findUnique.
    const moduleData = yield prisma_1.default.module.findFirst({
        where: { id: module, instructorId: instructor, isDeleted: false },
        include: { course: { select: { id: true, published: true } } },
    });
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    const instructorData = yield prisma_1.default.user.findFirst({
        where: { id: instructor, isDeleted: false },
    });
    if (!instructorData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This instructor don't exist !!!");
    }
    // videoOrder derived from max(existing active videoOrder) + 1, per the fix
    // in specs/01-fix-sequential-video-unlock-order.md — carried forward here.
    const maxOrder = yield prisma_1.default.video.aggregate({
        where: { moduleId: module, isDeleted: false },
        _max: { videoOrder: true },
    });
    const nextOrder = ((_a = maxOrder._max.videoOrder) !== null && _a !== void 0 ? _a : -1) + 1;
    const courseId = moduleData.course.id;
    const coursePublished = moduleData.course.published;
    const enrolledCourseUsers = coursePublished
        ? yield prisma_1.default.courseEnrollment.findMany({
            where: { courseId },
            select: { userId: true },
        })
        : [];
    // No denormalized Module.videos array to push into anymore — Video is
    // derived automatically via Video.moduleId.
    const video = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdVideo = yield tx.video.create({
            data: {
                title: payload.title,
                moduleId: module,
                instructorId: instructor,
                videoUrl,
                videoOrder: nextOrder,
            },
        });
        if (coursePublished) {
            yield (0, videoProgress_functions_1.addVideoCoursePublish)({
                enrolledCourseUsers,
                courseId,
                videoId: createdVideo.id,
                videoCount: nextOrder,
                moduleId: module,
                tx,
            });
        }
        return createdVideo;
    }));
    // Matches the original's response shape exactly: Mongoose's array-form
    // `.create([payload], { session })` (required for transaction support)
    // returned a 1-element array, which the controller passed straight
    // through as the response body.
    return [video];
    //
});
// ! for getting all the module video
const getAllVideo = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield prisma_1.default.module.findFirst({
        where: { id: moduleId, isDeleted: false },
    });
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    const allVideo = yield prisma_1.default.video.findMany({
        where: { moduleId, isDeleted: false },
    });
    return allVideo;
});
// ! for getting individual module video
const getSingleVideo = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield prisma_1.default.video.findFirst({
        where: {
            id: videoId,
            isDeleted: false,
        },
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    return videoData;
});
// ! for deleting a video
const deleteModuleVideo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId, moduleId } = payload;
    const videoData = yield prisma_1.default.video.findFirst({
        where: {
            id: videoId,
            moduleId,
            isDeleted: false,
        },
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    const deleteVideo = yield prisma_1.default.video.update({
        where: { id: videoId },
        data: { isDeleted: true },
    });
    return deleteVideo;
});
// ! for updating a video
const updateVideo = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
payload, videoId, videoUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const videoData = yield prisma_1.default.video.findFirst({
        where: { id: videoId, isDeleted: false },
    });
    if (!videoData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Video don't exist !!!");
    }
    if (videoUrl) {
        payload.videoUrl = videoUrl;
    }
    const updatedData = yield prisma_1.default.video.update({
        where: { id: videoId },
        data: payload,
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
