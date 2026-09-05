"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleValidations = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z.string().uuid({ message: "Invalid id !!!" });
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
