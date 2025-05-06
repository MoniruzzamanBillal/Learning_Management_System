"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const user_constants_1 = require("./user.constants");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
// ! for getting all instructors
router.get("/get-instructors", (0, authCheck_1.default)(user_constants_1.UserRole.admin), user_controller_1.userController.getAllInstructor);
//
exports.userRouter = router;
