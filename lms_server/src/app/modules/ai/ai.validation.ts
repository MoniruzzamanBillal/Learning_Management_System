import { z } from "zod";

const courseAdvisorSchema = z.object({
  query: z
    .string()
    .min(5, "Tell me a bit more about what you want to learn")
    .max(500),
});

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const studyAssistantSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

export const aiValidation = {
  courseAdvisorSchema,
  studyAssistantSchema,
};
