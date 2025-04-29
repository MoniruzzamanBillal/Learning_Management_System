import { NextFunction, Request, Response, Router } from "express";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { upload } from "../../util/SendImageCloudinary";
import { UserRole } from "../user/user.constants";
import { courseController } from "./course.controller";
import { courseValidations } from "./course.validation";

const router = Router();

// ! for getting all course data
router.get("/all-courses", courseController.getAllCourses);

// ! for getting all course data for admin
router.get(
  "/admin-all-courses",
  // authCheck(UserRole.admin),
  courseController.getAllCoursesForAdmin
);

// ! for getting all course data for admin and instructor
router.get(
  "/all-courses-modules",
  // authCheck(UserRole.admin, UserRole?.instructor),
  courseController.getAllCoursesWithModules
);

// ! for adding new course
router.post(
  "/add-course",
  authCheck(UserRole.admin),
  upload.single("courseCover"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);

    next();
  },
  validateRequest(courseValidations.crateCourseValidationSchema),
  courseController.createCourse
);

// ! for getting single course data
router.get("/course-detail/:id", courseController.getSingleCourse);

// ! for getting single course data , for admin
router.get(
  "/admin-course-detail/:id",
  authCheck(UserRole.admin),
  courseController.getCourseDetailsForAdmin
);

// ! for getting instructor assigned courses
router.get(
  "/instructor-courses/:instructorId",
  authCheck(UserRole.instructor),
  courseController.getInstructorsAssignCourses
);

// ! for updating a course
router.patch(
  "/update-course/:id",
  upload.single("courseCover"),
  authCheck(UserRole.admin),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);

    next();
  },
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseController.updateCourse
);

// ! for publishing a course
router.patch(
  "/publish-course/:id",
  authCheck(UserRole.admin),
  courseController.publishCourse
);

//

export const courseRouter = router;
