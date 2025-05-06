"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchemas = void 0;
const zod_1 = require("zod");
// ! for creating a user
const createUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format").min(4, "Email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
//
exports.userValidationSchemas = {
    createUserValidationSchema,
};
