import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import verifyCronSecret from "../../middleware/verifyCronSecret";
import { UserRole } from "../user/user.constants";
import { errorLogController } from "./errorLog.controller";

const router = Router();

// ! for getting all error logs
router.get("/", authCheck(UserRole.admin), errorLogController.getAllErrorLogs);

// ! for deleting error logs older than 30 days (Vercel Cron only) —
// replaces the Mongo TTL index. Registered before "/:id" so it isn't
// swallowed by that param route.
router.get(
  "/cleanup",
  verifyCronSecret,
  errorLogController.cleanupOldErrorLogs
);

// ! for getting a single error log
router.get("/:id", authCheck(UserRole.admin), errorLogController.getErrorLogById);

export const errorLogRouter = router;
