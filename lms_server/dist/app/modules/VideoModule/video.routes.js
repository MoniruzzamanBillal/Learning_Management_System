"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const VideoUpload_1 = require("../../util/VideoUpload");
const user_constants_1 = require("../user/user.constants");
const video_controller_1 = require("./video.controller");
const videol_validation_1 = require("./videol.validation");
const router = (0, express_1.Router)();
// ! for getting all video
router.get("/module-video", video_controller_1.videoController.getAllVideo);
// ! for adding a video
router.post("/add-video", 
//   authCheck(UserRole.admin, UserRole.instructor),
VideoUpload_1.uploadVideo.single("video"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, validateRequest_1.default)(videol_validation_1.videoValidationSchemas.addVideoValidationSchema), video_controller_1.videoController.addVideo);
// ! testing video upload
router.post("/add-video2", VideoUpload_1.uploadVideo.single("video"), video_controller_1.videoController.testVideoUpload);
// ! testing multiple video upload
router.post("/add-video3", VideoUpload_1.uploadVideo.array("video", 10), video_controller_1.videoController.uploadMultipleVideo);
// ! for deleting a video
router.patch("/delete-video", (0, authCheck_1.default)(user_constants_1.UserRole.admin, user_constants_1.UserRole.instructor), video_controller_1.videoController.deleteModuleVideo);
// ! for getting single vidoo
router.get("/individual-video/:videoId", video_controller_1.videoController.getIndividualvideo);
// ! for updating  a video
router.patch("/update-video/:id", (0, authCheck_1.default)(user_constants_1.UserRole.admin, user_constants_1.UserRole.instructor), VideoUpload_1.uploadVideo.single("video"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, video_controller_1.videoController.updateVideo);
//
exports.videoRouter = router;
