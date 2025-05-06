"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleValidations = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid object id !!!",
});
// ! for creating a module
const createModuleValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    course: objectIdSchema,
    videos: zod_1.z.array(objectIdSchema).optional(),
    instructor: objectIdSchema.optional(),
});
//
exports.moduleValidations = {
    createModuleValidationSchema,
};
