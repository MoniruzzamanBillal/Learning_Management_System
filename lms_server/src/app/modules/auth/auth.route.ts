import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchemas } from "../user/user.validation";
import { authControllers } from "./auth.controller";
import { upload } from "../../util/SendImageCloudinary";
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

// ! for login
router.post(
  "/login",
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser
);

//
export const authRouter = router;
