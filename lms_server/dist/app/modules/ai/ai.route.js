"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouter = void 0;
const express_1 = require("express");
const ai_controller_1 = require("./ai.controller");
const router = (0, express_1.Router)();
// ! for getting a course's AI review summary
router.get("/review-summary/:courseId", ai_controller_1.aiController.getReviewSummary);
exports.aiRouter = router;
