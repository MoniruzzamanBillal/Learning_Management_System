import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "../user/user.constants";
import validateRequest from "../../middleware/validateRequest";
import { courseValidations } from "./course.validation";
import { courseController } from "./course.controller";

const router = Router();

// ! for getting all course data
router.get("/all-courses", courseController.getAllCourses);

// ! for adding new course
router.post(
  "/add-course",
  // authCheck(UserRole.admin),
  validateRequest(courseValidations.crateCourseValidationSchema),
  courseController.createCourse
);

// ! for getting single corse data
router.get("/course-detail/:id", courseController.getSingleCourse);

// ! for updating a course
router.patch(
  "/update-course/:id",
  // authCheck(UserRole.admin),
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseController.updateCourse
);

//

export const courseRouter = router;
