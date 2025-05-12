import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "../user/user.constants";
import { userController } from "./user.controller";

const router = Router();

// ! for getting all instructors
router.get("/get-instructors", userController.getAllInstructor);

// ! for getting logged in user
router.get(
  "/loggedIn-user",
  authCheck(UserRole.admin, UserRole.instructor, UserRole.user),
  userController.getLoggedInUser
);

// ! change password 1st time login
router.patch(
  "/change-password",
  authCheck(UserRole.admin, UserRole.instructor, UserRole.user),
  userController.changePassword
);

//
export const userRouter = router;
