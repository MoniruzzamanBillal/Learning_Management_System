import { Router } from "express";
import { UserRole } from "../user/user.constants";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { videoValidationSchemas } from "./videol.validation";
import { videoController } from "./video.controller";
import { uploadVideo } from "../../util/VideoUpload";
import { uploadVideo } from "./../../util/VideoUpload";

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

// ! testing video upload
router.post(
  "/add-video2",
  uploadVideo.single("video"),
  videoController.testVideoUpload
);

// ! for deleting a video
router.patch(
  "/delete-video",
  // authCheck(UserRole.admin, UserRole.instructor),
  videoController.deleteModuleVideo
);

// ! for updating  a video
router.patch(
  "/update-video/:id",
  // authCheck(UserRole.admin, UserRole.instructor),
  videoController.updateVideo
);

//
export const videoRouter = router;
