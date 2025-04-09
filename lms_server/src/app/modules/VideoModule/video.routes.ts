import { NextFunction, Request, Response, Router } from "express";
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
  uploadVideo.single("video"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);

    next();
  },
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
