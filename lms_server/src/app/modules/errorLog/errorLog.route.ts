import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import { UserRole } from "../user/user.constants";
import { errorLogController } from "./errorLog.controller";

const router = Router();

// ! for getting all error logs
router.get("/", authCheck(UserRole.admin), errorLogController.getAllErrorLogs);

// ! for getting a single error log
router.get("/:id", authCheck(UserRole.admin), errorLogController.getErrorLogById);

export const errorLogRouter = router;
