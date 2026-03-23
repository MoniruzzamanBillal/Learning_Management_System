"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constants_1 = require("../user/user.constants");
const module_controller_1 = require("./module.controller");
const module_validation_1 = require("./module.validation");
const router = (0, express_1.Router)();
// ! for getting all module
router.get("/all-module", module_controller_1.moduleController.getAllModuleData);
// ! for adding a module
router.post("/add-module", 
//   authCheck(UserRole.admin, UserRole.instructor),
(0, validateRequest_1.default)(module_validation_1.moduleValidations.createModuleValidationSchema), module_controller_1.moduleController.addModule);
// ! for getting module data
router.get("/module-detail/:moduleId", module_controller_1.moduleController.getModuleData);
// ! get module data based on course id
router.get("/course-module-detail/:courseId", module_controller_1.moduleController.getModuleFromCourseId);
// ! for updating module
router.patch("/update-module/:moduleId", (0, authCheck_1.default)(user_constants_1.UserRole.instructor), module_controller_1.moduleController.updateModule);
//
exports.moduleRouter = router;
