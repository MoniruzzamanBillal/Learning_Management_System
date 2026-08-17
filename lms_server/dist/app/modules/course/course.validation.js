"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidations = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z.string().uuid({ message: "Invalid id !!!" });
// ! for crating course
const crateCourseValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Course name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    price: zod_1.z.number().nonnegative("Price must be a non-negative number"),
    category: zod_1.z.string().min(1, "Category is required"),
    instructors: zod_1.z.array(objectIdSchema).optional(),
    modules: zod_1.z.array(objectIdSchema).optional(),
});
// ! for updating course
const updateCourseValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Course name is required").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    price: zod_1.z
        .number()
        .nonnegative("Price must be a non-negative number")
        .optional(),
    category: zod_1.z.string().min(1, "Category is required").optional(),
});
//
exports.courseValidations = {
    crateCourseValidationSchema,
    updateCourseValidationSchema,
};
