"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseModel = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    published: { type: Boolean, default: false },
    courseCover: {
        type: String,
    },
    instructors: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    modules: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Module",
        },
    ],
}, { timestamps: true });
//
exports.courseModel = (0, mongoose_1.model)("Course", courseSchema);
