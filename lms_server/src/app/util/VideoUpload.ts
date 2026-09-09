import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const VIDEO_UPLOAD_FOLDER = "course_videos";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: VIDEO_UPLOAD_FOLDER,
    resource_type: "video",
    public_id: file?.originalname?.split(".")[0],
  }),
});

export const uploadVideo = multer({ storage });

// ! Signed credential for a direct browser-to-Cloudinary upload. Video files
// no longer pass through our own backend for add-video/update-video, since
// Vercel enforces a hard ~4.5MB request-body limit on serverless functions
// that made any real video upload fail with 413 (see
// context/specs/40-video-upload-413-vercel-body-limit.md). The client
// uploads the raw file straight to Cloudinary using this signature, then
// sends only the resulting URL (small JSON) to our API.
export const getVideoUploadSignature = () => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: VIDEO_UPLOAD_FOLDER };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    config.cloudinary_api_secret as string,
  );

  return {
    timestamp,
    signature,
    apiKey: config.cloudinary_api_key,
    cloudName: config.cloudinary_cloud_name,
    folder: VIDEO_UPLOAD_FOLDER,
  };
};
