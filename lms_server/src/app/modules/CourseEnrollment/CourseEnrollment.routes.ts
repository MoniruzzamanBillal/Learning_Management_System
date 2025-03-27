import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "../user/user.constants";
import { CourseEnrollmentController } from "./CourseEnrollment.controller";

const router = Router();

// ! for enrolling into a course
router.post(
  "/enroll-course",
  //   authCheck(UserRole.user),
  CourseEnrollmentController.enrollInCourse
);

//
export const courseEnrollmentRouter = router;
