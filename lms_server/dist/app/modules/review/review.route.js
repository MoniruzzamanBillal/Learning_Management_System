"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constants_1 = require("../user/user.constants");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = (0, express_1.Router)();
// ! for giving review
router.post("/give-review", (0, authCheck_1.default)(user_constants_1.UserRole.user), (0, validateRequest_1.default)(review_validation_1.reviewValidationSchema.addReviewSchema), review_controller_1.reviewController.addReview);
// ! for updating review
router.patch("/update-review", (0, authCheck_1.default)(user_constants_1.UserRole.user), review_controller_1.reviewController.updateReview);
// ! for getting course review
router.get("/course-review/:courseId", review_controller_1.reviewController.getCourseReview);
// ! for checking review eligibility
router.get("/check-review-eligibility/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), review_controller_1.reviewController.checkReviewEligibility);
exports.reviewRouter = router;
