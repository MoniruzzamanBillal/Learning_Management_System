"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const ValidateCourseAccess_1 = __importDefault(require("../../middleware/ValidateCourseAccess"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constants_1 = require("../user/user.constants");
const quiz_controller_1 = require("./quiz.controller");
const quiz_validation_1 = require("./quiz.validation");
const router = (0, express_1.Router)();
// ! for creating a quiz for a module
router.post("/", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), (0, validateRequest_1.default)(quiz_validation_1.quizValidationSchema.createQuizSchema), quiz_controller_1.quizController.createQuiz);
// ! for the instructor/admin authoring view of a module's quiz
router.get("/manage/:moduleId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor, user_constants_1.UserRole.admin), quiz_controller_1.quizController.getQuizForManage);
// ! for updating a quiz
router.patch("/:quizId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), (0, validateRequest_1.default)(quiz_validation_1.quizValidationSchema.updateQuizSchema), quiz_controller_1.quizController.updateQuiz);
// ! for soft-deleting a quiz
router.delete("/:quizId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), quiz_controller_1.quizController.deleteQuiz);
// ! for a student opening a module's quiz
router.get("/take/:courseId/:moduleId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, quiz_controller_1.quizController.getQuizToTake);
// ! for a student submitting a quiz
router.post("/submit/:courseId/:quizId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, (0, validateRequest_1.default)(quiz_validation_1.quizValidationSchema.submitQuizSchema), quiz_controller_1.quizController.submitQuiz);
exports.quizRouter = router;
