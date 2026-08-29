import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import ValidateCourseAccess from "../../middleware/ValidateCourseAccess";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.constants";
import { quizController } from "./quiz.controller";
import { quizValidationSchema } from "./quiz.validation";

const router = Router();

// ! for creating a quiz for a module
router.post(
  "/",
  authCheck(UserRole.instructor),
  validateRequest(quizValidationSchema.createQuizSchema),
  quizController.createQuiz,
);

// ! for the instructor/admin authoring view of a module's quiz
router.get(
  "/manage/:moduleId",
  authCheck(UserRole.instructor, UserRole.admin),
  quizController.getQuizForManage,
);

// ! for updating a quiz
router.patch(
  "/:quizId",
  authCheck(UserRole.instructor),
  validateRequest(quizValidationSchema.updateQuizSchema),
  quizController.updateQuiz,
);

// ! for soft-deleting a quiz
router.delete(
  "/:quizId",
  authCheck(UserRole.instructor),
  quizController.deleteQuiz,
);

// ! for a student opening a module's quiz
router.get(
  "/take/:courseId/:moduleId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  quizController.getQuizToTake,
);

// ! for a student submitting a quiz
router.post(
  "/submit/:courseId/:quizId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  validateRequest(quizValidationSchema.submitQuizSchema),
  quizController.submitQuiz,
);

export const quizRouter = router;
