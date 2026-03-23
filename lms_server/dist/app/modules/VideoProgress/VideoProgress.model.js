"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoProgressModel = void 0;
const mongoose_1 = require("mongoose");
const VideoProgress_constants_1 = require("./VideoProgress.constants");
const videoProgressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: "Module", required: true },
    video: { type: mongoose_1.Schema.Types.ObjectId, ref: "Video", required: true },
    videoStatus: {
        type: String,
        enum: Object.values(VideoProgress_constants_1.videoProgressStatus),
    },
}, { timestamps: true });
//
exports.videoProgressModel = (0, mongoose_1.model)("VideoProgress", videoProgressSchema);
