import { Router } from "express";
import { testRouter } from "../modules/boilerModule/test.route";
import { authRouter } from "../modules/auth/auth.route";

const router = Router();

const routeArray = [
  {
    path: "/test",
    route: testRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
];

routeArray.forEach((item) => {
  router.use(item.path, item.route);
});

export const MainRouter = router;
