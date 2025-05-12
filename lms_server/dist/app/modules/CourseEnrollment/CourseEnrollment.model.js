"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseEnrollmentModel = void 0;
const mongoose_1 = require("mongoose");
const courseEnrollmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    Payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    isDeleted: { type: Boolean, default: false },
    isReviewed: { type: Boolean, default: false },
}, { timestamps: true });
//
exports.courseEnrollmentModel = (0, mongoose_1.model)("CourseEnrollment", courseEnrollmentSchema);
