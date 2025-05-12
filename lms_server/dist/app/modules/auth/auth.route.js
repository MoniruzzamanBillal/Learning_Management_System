"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const user_constants_1 = require("../user/user.constants");
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// ! for registering a user
router.post("/register", SendImageCloudinary_1.upload.single("profileImg"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.userValidationSchemas.createUserValidationSchema), auth_controller_1.authControllers.createUser);
// ! for registering an instructor
router.post("/register-instructor", (0, authCheck_1.default)(user_constants_1.UserRole.admin), SendImageCloudinary_1.upload.single("profileImg"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.userValidationSchemas.createInstructorValidationSchema), auth_controller_1.authControllers.createInstructor);
// ! for login
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controller_1.authControllers.loginUser);
//
exports.authRouter = router;
