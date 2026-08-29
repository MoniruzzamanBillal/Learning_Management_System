"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoNoteRouter = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const ValidateCourseAccess_1 = __importDefault(require("../../middleware/ValidateCourseAccess"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constants_1 = require("../user/user.constants");
const VideoNote_controller_1 = require("./VideoNote.controller");
const VideoNote_validation_1 = require("./VideoNote.validation");
const router = (0, express_1.Router)();
// ! for getting the caller's own note for a video
router.get("/:courseId/:videoId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, VideoNote_controller_1.videoNoteController.getMyVideoNote);
// ! for creating/updating the caller's note for a video
router.put("/:courseId/:videoId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, (0, validateRequest_1.default)(VideoNote_validation_1.videoNoteValidationSchema.upsertVideoNoteSchema), VideoNote_controller_1.videoNoteController.upsertVideoNote);
// ! for soft-deleting the caller's note for a video
router.delete("/:courseId/:videoId", (0, authCheck_1.default)(user_constants_1.UserRole.user), ValidateCourseAccess_1.default, VideoNote_controller_1.videoNoteController.deleteVideoNote);
exports.videoNoteRouter = router;
