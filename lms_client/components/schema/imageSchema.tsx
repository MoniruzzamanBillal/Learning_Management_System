import { z } from "zod";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];

export const imageSchema = z
  .union([z.string().min(1, "Image is required"), z.instanceof(File)])
  .refine(
    (value) => {
      // Allow existing URL
      if (typeof value === "string") return true;

      return SUPPORTED_FORMATS.includes(value.type);
    },
    {
      message: "Only JPG, JPEG, PNG or SVG files are allowed",
    },
  )
  .refine(
    (value) => {
      // Allow existing URL
      if (typeof value === "string") return true;

      return value.size <= FILE_SIZE;
    },
    {
      message: "File size must be less than 5MB",
    },
  );
