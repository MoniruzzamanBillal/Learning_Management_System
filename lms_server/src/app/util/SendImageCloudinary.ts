import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const SendImageCloudinary = async (path: string, name: string) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: name,
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
};

const removeExtension = (filename: string) => {
  return filename.split(".").slice(0, -1).join(".");
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    public_id: (_req, file) =>
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      file.fieldname +
      "-" +
      removeExtension(file.originalname),
  },
});

export const upload = multer({ storage });
