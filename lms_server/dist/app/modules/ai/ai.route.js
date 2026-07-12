"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const ValidateCourseAccess_1 = __importDefault(require("../../middleware/ValidateCourseAccess"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constants_1 = require("../user/user.constants");
const ai_controller_1 = require("./ai.controller");
const ai_validation_1 = require("./ai.validation");
const router = (0, express_1.Router)();
// ! for getting a course's AI review summary
router.get("/review-summary/:courseId", ai_controller_1.aiController.getReviewSummary);
// ! for getting AI course recommendations based on a learning goal
router.post("/course-advisor", (0, validateRequest_1.default)(ai_validation_1.aiValidation.courseAdvisorSchema), ai_controller_1.aiController.getCourseAdvice);
// ! for chatting with the in-course study assistant (enrolled + paid students only)
router.post("/study-assistant/:courseId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, (0, validateRequest_1.default)(ai_validation_1.aiValidation.studyAssistantSchema), ai_controller_1.aiController.getStudyAssistantReply);
exports.aiRouter = router;
