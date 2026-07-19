"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const user_constants_1 = require("../user/user.constants");
const errorLog_controller_1 = require("./errorLog.controller");
const router = (0, express_1.Router)();
// ! for getting all error logs
router.get("/", (0, authCheck_1.default)(user_constants_1.UserRole.admin), errorLog_controller_1.errorLogController.getAllErrorLogs);
// ! for getting a single error log
router.get("/:id", (0, authCheck_1.default)(user_constants_1.UserRole.admin), errorLog_controller_1.errorLogController.getErrorLogById);
exports.errorLogRouter = router;
