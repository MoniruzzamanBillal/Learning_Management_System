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
const chatMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(["user", "assistant"]),
    content: zod_1.z.string().min(1).max(2000),
});
const studyAssistantSchema = zod_1.z.object({
    messages: zod_1.z.array(chatMessageSchema).min(1).max(20),
});
exports.aiValidation = {
    courseAdvisorSchema,
    studyAssistantSchema,
};
