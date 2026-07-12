import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import ValidateCourseAccess from "../../middleware/ValidateCourseAccess";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.constants";
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

// ! for chatting with the in-course study assistant (enrolled + paid students only)
router.post(
  "/study-assistant/:courseId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  validateRequest(aiValidation.studyAssistantSchema),
  aiController.getStudyAssistantReply,
);

export const aiRouter = router;
