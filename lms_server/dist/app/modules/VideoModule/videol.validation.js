"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidationSchemas = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z.string().uuid({ message: "Invalid id !!!" });
// ! for adding video
const addVideoValidationSchema = zod_1.z.object({
    module: objectIdSchema,
    title: zod_1.z.string().min(1, "Title is required"),
    instructor: objectIdSchema,
});
//
exports.videoValidationSchemas = {
    addVideoValidationSchema,
};
