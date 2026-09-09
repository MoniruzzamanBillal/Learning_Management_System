import { Router } from "express";
import authCheck from "../../middleware/authCheck";
import validateRequest from "../../middleware/validateRequest";
import { uploadVideo } from "../../util/VideoUpload";
import { UserRole } from "../user/user.constants";
import { videoController } from "./video.controller";
import { videoValidationSchemas } from "./videol.validation";

const router = Router();

// ! for getting all video
router.get("/module-video", videoController.getAllVideo);

// ! for getting a signed direct-to-Cloudinary upload credential (video
// files upload straight from the browser to Cloudinary, never through this
// backend — see context/specs/40-video-upload-413-vercel-body-limit.md)
router.post(
  "/upload-signature",
  authCheck(UserRole.admin, UserRole.instructor),
  videoController.getUploadSignature
);

// ! for adding a video
router.post(
  "/add-video",
  authCheck(UserRole.admin, UserRole.instructor),
  validateRequest(videoValidationSchemas.addVideoValidationSchema),
  videoController.addVideo
);

// ! testing video upload
router.post(
  "/add-video2",
  uploadVideo.single("video"),
  videoController.testVideoUpload
);

// ! testing multiple video upload
router.post(
  "/add-video3",
  uploadVideo.array("video", 10),
  videoController.uploadMultipleVideo
);

// ! for deleting a video
router.patch(
  "/delete-video",
  authCheck(UserRole.admin, UserRole.instructor),
  videoController.deleteModuleVideo
);

// ! for getting single vidoo
router.get("/individual-video/:videoId", videoController.getIndividualvideo);

// ! for updating  a video
router.patch(
  "/update-video/:id",
  authCheck(UserRole.admin, UserRole.instructor),
  videoController.updateVideo
);

//
export const videoRouter = router;
