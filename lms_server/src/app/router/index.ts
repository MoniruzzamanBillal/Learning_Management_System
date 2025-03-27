import { Router } from "express";

import { authRouter } from "../modules/auth/auth.route";
import { courseRouter } from "../modules/course/course.routes";
import { moduleRouter } from "../modules/courseModule/module.routes";
import { videoRouter } from "../modules/VideoModule/video.routes";
import { courseEnrollmentRouter } from "../modules/CourseEnrollment/CourseEnrollment.routes";

const router = Router();

const routeArray = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/course",
    route: courseRouter,
  },
  {
    path: "/module",
    route: moduleRouter,
  },
  {
    path: "/video",
    route: videoRouter,
  },
  {
    path: "/enroll",
    route: courseEnrollmentRouter,
  },
];

routeArray.forEach((item) => {
  router.use(item.path, item.route);
});

export const MainRouter = router;
