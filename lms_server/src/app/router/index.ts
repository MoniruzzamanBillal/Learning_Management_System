import { Router } from "express";

import { authRouter } from "../modules/auth/auth.route";
import { courseRouter } from "../modules/course/course.routes";
import { moduleRouter } from "../modules/courseModule/module.routes";

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
];

routeArray.forEach((item) => {
  router.use(item.path, item.route);
});

export const MainRouter = router;
