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

// ! for getting all user's enrolled course
router.get(
  "/user-all-enrolled-couses",
  authCheck(UserRole.user),
  CourseEnrollmentController.getAllUserEnrolledCourse
);

// ! get user's finished course
router.get(
  "/user-finished-course",
  authCheck(UserRole.user),
  CourseEnrollmentController.usersFinishedCourses
);

// ! for enrolling into a course
router.post(
  "/enroll-course",
  authCheck(UserRole.user),
  CourseEnrollmentController.enrollInCourse
);

// ! for getting user single enrolled course data
router.get(
  "/my-enrolled-course/:courseId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  CourseEnrollmentController.getMyCourseEnrollData
);

// ! for checking user enrolled a coure or not
router.get(
  "/check-user-enrolled/:courseId",
  authCheck(UserRole.user),
  CourseEnrollmentController.checkUserEnrolledInCourse
);

// ! for getting module data for enrolled course
router.get(
  "/my-enrolled-course-modules/:courseId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  CourseEnrollmentController.getModuleDataEnrlledCourse
);

// ! for getting video for enrolled course
router.get(
  "/my-enrolled-course-videos/:videoId",
  authCheck(UserRole.user),
  CourseEnrollmentController.getVideoDataEnrlledCourse
);

// ! for getting course progress percentage
router.get(
  "/my-course-progress/:courseId",
  authCheck(UserRole.user),
  CourseEnrollmentController.courseProgressPercentage
);

// ! based on module id , find video data for enrolled user
router.get(
  "/module-videos/:moduleId",
  authCheck(UserRole.user),
  CourseEnrollmentController.getUserEnrolledModuleVideos
);

//  ! for marking course as complete
router.patch(
  "/complete-my-course/:courseId",
  authCheck(UserRole.user),
  CourseEnrollmentController.markCompleteCourse
);

//
export const courseEnrollmentRouter = router;
