"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const ValidateCourseAccess_1 = __importDefault(require("../../middleware/ValidateCourseAccess"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constants_1 = require("../user/user.constants");
const assignment_controller_1 = require("./assignment.controller");
const assignment_validation_1 = require("./assignment.validation");
const router = (0, express_1.Router)();
// ! for creating an assignment for a module
router.post("/", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), (0, validateRequest_1.default)(assignment_validation_1.assignmentValidationSchema.createAssignmentSchema), assignment_controller_1.assignmentController.createAssignment);
// ! for the instructor/admin authoring view of a module's assignment
router.get("/manage/:moduleId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor, user_constants_1.UserRole.admin), assignment_controller_1.assignmentController.getAssignmentForManage);
// ! for updating an assignment
router.patch("/:assignmentId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), (0, validateRequest_1.default)(assignment_validation_1.assignmentValidationSchema.updateAssignmentSchema), assignment_controller_1.assignmentController.updateAssignment);
// ! for soft-deleting an assignment
router.delete("/:assignmentId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), assignment_controller_1.assignmentController.deleteAssignment);
// ! for the instructor/admin grading list of an assignment's submissions
router.get("/submissions/:assignmentId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor, user_constants_1.UserRole.admin), assignment_controller_1.assignmentController.getAssignmentSubmissions);
// ! for a student opening a module's assignment
router.get("/take/:courseId/:moduleId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, assignment_controller_1.assignmentController.getAssignmentToTake);
// ! for a student submitting/resubmitting an assignment
router.put("/submit/:courseId/:assignmentId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, (0, validateRequest_1.default)(assignment_validation_1.assignmentValidationSchema.submitAssignmentSchema), assignment_controller_1.assignmentController.submitAssignment);
// ! for an instructor grading a submission
router.patch("/grade/:submissionId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), (0, validateRequest_1.default)(assignment_validation_1.assignmentValidationSchema.gradeSubmissionSchema), assignment_controller_1.assignmentController.gradeSubmission);
// ! for an instructor reopening a graded submission
router.patch("/reopen/:submissionId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), assignment_controller_1.assignmentController.reopenSubmission);
exports.assignmentRouter = router;
