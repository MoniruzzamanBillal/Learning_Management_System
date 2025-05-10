import { NextFunction, Request, Response, Router } from "express";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { upload } from "../../util/SendImageCloudinary";
import { UserRole } from "../user/user.constants";
import { userValidationSchemas } from "../user/user.validation";
import { authControllers } from "./auth.controller";
import { authValidations } from "./auth.validation";

const router = Router();

// ! for registering a user
router.post(
  "/register",
  upload.single("profileImg"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);
    next();
  },
  validateRequest(userValidationSchemas.createUserValidationSchema),
  authControllers.createUser
);

// ! for registering an instructor
router.post(
  "/register-instructor",
  authCheck(UserRole.admin),
  upload.single("profileImg"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);
    next();
  },
  validateRequest(userValidationSchemas.createInstructorValidationSchema),
  authControllers.createInstructor
);

// ! for login
router.post(
  "/login",
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser
);

//
export const authRouter = router;
