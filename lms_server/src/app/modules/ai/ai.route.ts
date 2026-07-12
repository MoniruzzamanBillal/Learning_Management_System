import { Router } from "express";
import { aiController } from "./ai.controller";

const router = Router();

// ! for getting a course's AI review summary
router.get("/review-summary/:courseId", aiController.getReviewSummary);

export const aiRouter = router;
