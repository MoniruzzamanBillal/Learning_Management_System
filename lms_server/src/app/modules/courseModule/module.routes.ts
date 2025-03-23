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

// ! for getting module data
router.get("/module-detail/:id", moduleController.getModuleData);

// ! for updating module
router.patch(
  "/update-module/:id",
  // authCheck(UserRole.instructor),
  moduleController.updateModule
);

//
export const moduleRouter = router;
