"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewModel = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required "],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course is required "],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required !!"],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, "Comment is required !!"],
    },
}, { timestamps: true });
//
exports.reviewModel = (0, mongoose_1.model)("Review", reviewSchema);
