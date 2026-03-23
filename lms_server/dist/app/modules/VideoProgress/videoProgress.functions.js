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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVideoCoursePublish = void 0;
const VideoProgress_constants_1 = require("./VideoProgress.constants");
const VideoProgress_model_1 = require("./VideoProgress.model");
// ! add video in course progress , if new video added after course is published
const addVideoCoursePublish = (_a) => __awaiter(void 0, [_a], void 0, function* ({ enrolledCourseUsers, courseId, videoId, videoCount, moduleId, session, }) {
    const videoProgressPayload = enrolledCourseUsers === null || enrolledCourseUsers === void 0 ? void 0 : enrolledCourseUsers.map((enrollment) => {
        var _a;
        return ({
            user: (_a = enrollment === null || enrollment === void 0 ? void 0 : enrollment.user) === null || _a === void 0 ? void 0 : _a.toString(),
            course: courseId,
            module: moduleId,
            video: videoId,
            videoStatus: videoCount === 0
                ? VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.unlocked
                : VideoProgress_constants_1.videoProgressStatus === null || VideoProgress_constants_1.videoProgressStatus === void 0 ? void 0 : VideoProgress_constants_1.videoProgressStatus.locked,
        });
    });
    yield VideoProgress_model_1.videoProgressModel.insertMany(videoProgressPayload, { session });
});
exports.addVideoCoursePublish = addVideoCoursePublish;
