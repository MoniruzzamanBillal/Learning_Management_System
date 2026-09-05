import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import ValidateCourseAccess from "../../middleware/ValidateCourseAccess";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.constants";
import { assignmentController } from "./assignment.controller";
import { assignmentValidationSchema } from "./assignment.validation";

const router = Router();

// ! for creating an assignment for a module
router.post(
  "/",
  authCheck(UserRole.instructor),
  validateRequest(assignmentValidationSchema.createAssignmentSchema),
  assignmentController.createAssignment,
);

// ! for the instructor/admin authoring view of a module's assignment
router.get(
  "/manage/:moduleId",
  authCheck(UserRole.instructor, UserRole.admin),
  assignmentController.getAssignmentForManage,
);

// ! for updating an assignment
router.patch(
  "/:assignmentId",
  authCheck(UserRole.instructor),
  validateRequest(assignmentValidationSchema.updateAssignmentSchema),
  assignmentController.updateAssignment,
);

// ! for soft-deleting an assignment
router.delete(
  "/:assignmentId",
  authCheck(UserRole.instructor),
  assignmentController.deleteAssignment,
);

// ! for the instructor/admin grading list of an assignment's submissions
router.get(
  "/submissions/:assignmentId",
  authCheck(UserRole.instructor, UserRole.admin),
  assignmentController.getAssignmentSubmissions,
);

// ! for a student opening a module's assignment
router.get(
  "/take/:courseId/:moduleId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  assignmentController.getAssignmentToTake,
);

// ! for a student submitting/resubmitting an assignment
router.put(
  "/submit/:courseId/:assignmentId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  validateRequest(assignmentValidationSchema.submitAssignmentSchema),
  assignmentController.submitAssignment,
);

// ! for an instructor grading a submission
router.patch(
  "/grade/:submissionId",
  authCheck(UserRole.instructor),
  validateRequest(assignmentValidationSchema.gradeSubmissionSchema),
  assignmentController.gradeSubmission,
);

// ! for an instructor reopening a graded submission
router.patch(
  "/reopen/:submissionId",
  authCheck(UserRole.instructor),
  assignmentController.reopenSubmission,
);

export const assignmentRouter = router;
