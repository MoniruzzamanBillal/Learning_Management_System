import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.constants";
import { moduleController } from "./module.controller";
import { moduleValidations } from "./module.validation";

const router = Router();

// ! for getting all module
router.get("/all-module", moduleController.getAllModuleData);

// ! for adding a module
router.post(
  "/add-module",
  //   authCheck(UserRole.admin, UserRole.instructor),
  validateRequest(moduleValidations.createModuleValidationSchema),
  moduleController.addModule
);

// ! for getting module data
router.get("/module-detail/:moduleId", moduleController.getModuleData);

// ! get module data based on course id
router.get(
  "/course-module-detail/:courseId",
  moduleController.getModuleFromCourseId
);

// ! for updating module
router.patch(
  "/update-module/:moduleId",
  authCheck(UserRole.instructor),
  moduleController.updateModule
);

//
export const moduleRouter = router;
