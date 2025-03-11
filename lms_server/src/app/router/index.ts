import { Router } from "express";
import { testRouter } from "../modules/boilerModule/test.route";

const router = Router();

const routeArray = [
  {
    path: "/test",
    route: testRouter,
  },
];

routeArray.forEach((item) => {
  router.use(item.path, item.route);
});

export const MainRouter = router;
