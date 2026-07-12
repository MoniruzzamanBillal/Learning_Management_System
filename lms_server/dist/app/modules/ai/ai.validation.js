"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiValidation = void 0;
const zod_1 = require("zod");
const courseAdvisorSchema = zod_1.z.object({
    query: zod_1.z
        .string()
        .min(5, "Tell me a bit more about what you want to learn")
        .max(500),
});
exports.aiValidation = {
    courseAdvisorSchema,
};
