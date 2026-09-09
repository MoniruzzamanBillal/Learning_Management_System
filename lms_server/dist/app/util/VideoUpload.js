"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoUploadSignature = exports.uploadVideo = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const VIDEO_UPLOAD_FOLDER = "course_videos";
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        return ({
            folder: VIDEO_UPLOAD_FOLDER,
            resource_type: "video",
            public_id: (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.split(".")[0],
        });
    }),
});
exports.uploadVideo = (0, multer_1.default)({ storage });
// ! Signed credential for a direct browser-to-Cloudinary upload. Video files
// no longer pass through our own backend for add-video/update-video, since
// Vercel enforces a hard ~4.5MB request-body limit on serverless functions
// that made any real video upload fail with 413 (see
// context/specs/40-video-upload-413-vercel-body-limit.md). The client
// uploads the raw file straight to Cloudinary using this signature, then
// sends only the resulting URL (small JSON) to our API.
const getVideoUploadSignature = () => {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder: VIDEO_UPLOAD_FOLDER };
    const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, config_1.default.cloudinary_api_secret);
    return {
        timestamp,
        signature,
        apiKey: config_1.default.cloudinary_api_key,
        cloudName: config_1.default.cloudinary_cloud_name,
        folder: VIDEO_UPLOAD_FOLDER,
    };
};
exports.getVideoUploadSignature = getVideoUploadSignature;
