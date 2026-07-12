import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { aiController } from "./ai.controller";
import { aiValidation } from "./ai.validation";

const router = Router();

// ! for getting a course's AI review summary
router.get("/review-summary/:courseId", aiController.getReviewSummary);

// ! for getting AI course recommendations based on a learning goal
router.post(
  "/course-advisor",
  validateRequest(aiValidation.courseAdvisorSchema),
  aiController.getCourseAdvice,
);

export const aiRouter = router;
