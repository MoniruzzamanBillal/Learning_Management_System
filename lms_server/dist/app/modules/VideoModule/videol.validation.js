"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidationSchemas = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid object id !!!",
});
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
