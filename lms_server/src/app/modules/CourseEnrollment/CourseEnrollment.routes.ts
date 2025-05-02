import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import ValidateCourseAccess from "../../middleware/ValidateCourseAccess";
import { UserRole } from "../user/user.constants";
import { CourseEnrollmentController } from "./CourseEnrollment.controller";

const router = Router();

// ! for getting enrollment course info
router.get(
  "/enrollment-data",
  authCheck(UserRole.admin),
  CourseEnrollmentController.enrollmentsPerCourse
);

// ! for enrolling into a course
router.post(
  "/enroll-course",
  authCheck(UserRole.user),
  CourseEnrollmentController.enrollInCourse
);

// ! for getting all user's enrolled course
router.get(
  "/user-all-enrolled-couses",
  authCheck(UserRole.user),
  CourseEnrollmentController.getAllUserEnrolledCourse
);

// ! for getting user single enrolled course data
router.get(
  "/my-enrolled-course/:courseId",
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

// ! for getting video for enrolled course
router.get(
  "/my-enrolled-course-videos/:id",
  authCheck(UserRole.user),
  CourseEnrollmentController.getVideoDataEnrlledCourse
);

// ! for getting course progress percentage
router.get(
  "/my-course-progress/:courseId",
  authCheck(UserRole.user),
  CourseEnrollmentController.courseProgressPercentage
);

//
export const courseEnrollmentRouter = router;
