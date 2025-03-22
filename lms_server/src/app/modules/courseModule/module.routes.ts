import { Router } from "express";
import { UserRole } from "../user/user.constants";
import validateRequest from "../../middleware/validateRequest";
import { moduleValidations } from "./module.validation";
import authCheck from "../../middleware/authCheck";
import { moduleController } from "./module.controller";

const router = Router();

// ! for adding a module
router.post(
  "/add-module",
  //   authCheck(UserRole.admin, UserRole.instructor),
  validateRequest(moduleValidations.createModuleValidationSchema),
  moduleController.addModule
);

//
export const moduleRouter = router;
