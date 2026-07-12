import { z } from "zod";

const courseAdvisorSchema = z.object({
  query: z
    .string()
    .min(5, "Tell me a bit more about what you want to learn")
    .max(500),
});

export const aiValidation = {
  courseAdvisorSchema,
};
