import { Router } from "express";
import { UserRole } from "../user/user.constants";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { videoValidationSchemas } from "./videol.validation";
import { videoController } from "./video.controller";

const router = Router();

// ! for getting all video
router.get("/module-video", videoController.getAllVideo);

// ! for getting single vidoo
router.get("/individual-video", videoController.getIndividualvideo);

// ! for adding a video
router.post(
  "/add-video",
  //   authCheck(UserRole.admin, UserRole.instructor),
  validateRequest(videoValidationSchemas.addVideoValidationSchema),
  videoController.addVideo
);

//
export const videoRouter = router;
