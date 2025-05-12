"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const user_constants_1 = require("../user/user.constants");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
// ! for getting all instructors
router.get("/get-instructors", user_controller_1.userController.getAllInstructor);
// ! for getting logged in user
router.get("/loggedIn-user", (0, authCheck_1.default)(user_constants_1.UserRole.admin, user_constants_1.UserRole.instructor, user_constants_1.UserRole.user), user_controller_1.userController.getLoggedInUser);
// ! for updating a user
router.patch("/update-user", SendImageCloudinary_1.upload.single("profileImg"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, authCheck_1.default)(user_constants_1.UserRole.admin, user_constants_1.UserRole.instructor, user_constants_1.UserRole.user), user_controller_1.userController.updateUser);
// ! change password 1st time login
router.patch("/change-password", (0, authCheck_1.default)(user_constants_1.UserRole.admin, user_constants_1.UserRole.instructor, user_constants_1.UserRole.user), user_controller_1.userController.changePassword);
// ! for getting specific user
router.get("/get-user/:userId", (0, authCheck_1.default)(user_constants_1.UserRole.admin, user_constants_1.UserRole.instructor, user_constants_1.UserRole.user), user_controller_1.userController.getLoggedInUser);
//
exports.userRouter = router;
