import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "../user/user.constants";
import validateRequest from "../../middleware/validateRequest";
import { courseValidations } from "./course.validation";
import { courseController } from "./course.controller";

const router = Router();

// ! for adding new course
router.post(
  "/add-course",
  authCheck(UserRole.admin),
  validateRequest(courseValidations.crateCourseValidationSchema),
  courseController.createCourse
);

//

export const courseRouter = router;
