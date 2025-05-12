"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidationSchema = void 0;
const zod_1 = require("zod");
const addReviewSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User id is required !!!"),
    courseId: zod_1.z.string().min(1, "course id is required !!!"),
    comment: zod_1.z.string().min(2, "comment is required !!!"),
    rating: zod_1.z
        .number()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating must not exceed 5" }),
});
//
exports.reviewValidationSchema = {
    addReviewSchema,
};
