import { Router } from "express";

import { authRouter } from "../modules/auth/auth.route";
import { courseRouter } from "../modules/course/course.routes";
import { courseEnrollmentRouter } from "../modules/CourseEnrollment/CourseEnrollment.routes";
import { moduleRouter } from "../modules/courseModule/module.routes";
import { paymentRoute } from "../modules/payment/payment.routes";
import { reviewRouter } from "../modules/review/review.route";
import { userRouter } from "../modules/user/user.route";
import { videoRouter } from "../modules/VideoModule/video.routes";

const router = Router();

const routeArray = [
  {
    path: "/user",
    route: userRouter,
  },
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
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/review",
    route: reviewRouter,
  },
];

routeArray.forEach((item) => {
  router.use(item.path, item.route);
});

export const MainRouter = router;
