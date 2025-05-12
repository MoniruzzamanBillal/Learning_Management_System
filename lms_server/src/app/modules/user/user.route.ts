import { NextFunction, Request, Response, Router } from "express";
import authCheck from "../../middleware/authCheck";
import { upload } from "../../util/SendImageCloudinary";
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

// ! for updating a user
router.patch(
  "/update-user",
  upload.single("profileImg"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);
    next();
  },
  authCheck(UserRole.admin, UserRole.instructor, UserRole.user),
  userController.updateUser
);

// ! change password 1st time login
router.patch(
  "/change-password",
  authCheck(UserRole.admin, UserRole.instructor, UserRole.user),
  userController.changePassword
);

// ! for getting specific user
router.get(
  "/get-user/:userId",
  authCheck(UserRole.admin, UserRole.instructor, UserRole.user),
  userController.getLoggedInUser
);

//
export const userRouter = router;
