import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "../user/user.constants";
import { CourseEnrollmentController } from "./CourseEnrollment.controller";
import ValidateCourseAccess from "../../middleware/ValidateCourseAccess";

const router = Router();

// ! for enrolling into a course
router.post(
  "/enroll-course",
  //   authCheck(UserRole.user),
  CourseEnrollmentController.enrollInCourse
);

// ! for getting enrolled course data
router.get(
  "/my-enrolled-course/:id",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  CourseEnrollmentController.getMyCourseEnrollData
);

// ! for getting module data for enrolled course
router.get(
  "/my-enrolled-course-modules/:id",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  CourseEnrollmentController.getModuleDataEnrlledCourse
);

//
export const courseEnrollmentRouter = router;
