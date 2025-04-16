import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "./user.constants";
import { userController } from "./user.controller";

const router = Router();

// ! for getting all instructors
router.get(
  "/get-instructors",
  authCheck(UserRole.admin),
  userController.getAllInstructor
);

//
export const userRouter = router;
