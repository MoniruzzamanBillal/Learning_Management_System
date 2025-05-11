import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.constants";
import { reviewController } from "./review.controller";
import { reviewValidationSchema } from "./review.validation";

const router = Router();

// ! for giving review
router.post(
  "/give-review",
  authCheck(UserRole.user),
  validateRequest(reviewValidationSchema.addReviewSchema),
  reviewController.addReview
);

// ! for updating review
router.post(
  "/update-review",
  authCheck(UserRole.user),
  reviewController.updateReview
);

export const reviewRouter = router;
