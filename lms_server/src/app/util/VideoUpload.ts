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

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "course_videos",
    resource_type: "video",
    public_id: file?.originalname?.split(".")[0],
  }),
});

export const uploadVideo = multer({ storage });
