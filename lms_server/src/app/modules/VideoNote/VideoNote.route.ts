import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import ValidateCourseAccess from "../../middleware/ValidateCourseAccess";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.constants";
import { videoNoteController } from "./VideoNote.controller";
import { videoNoteValidationSchema } from "./VideoNote.validation";

const router = Router();

// ! for getting the caller's own note for a video
router.get(
  "/:courseId/:videoId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  videoNoteController.getMyVideoNote,
);

// ! for creating/updating the caller's note for a video
router.put(
  "/:courseId/:videoId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  validateRequest(videoNoteValidationSchema.upsertVideoNoteSchema),
  videoNoteController.upsertVideoNote,
);

// ! for soft-deleting the caller's note for a video
router.delete(
  "/:courseId/:videoId",
  authCheck(UserRole.user),
  ValidateCourseAccess,
  videoNoteController.deleteVideoNote,
);

export const videoNoteRouter = router;
