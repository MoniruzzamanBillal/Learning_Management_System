"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

// import plaveholderGalleryImg from "@/../public/placeholderImage.jpg";
// import plaveholderGalleryImg from "https://i.postimg.cc/gJzsJpY6/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpg";

const SUPPORTED_IMAGE_FORMATS = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

interface FileUploadControllerProps {
  name: string;
  className?: string;
  initialUrl?: string;
  label?: string;
}

export function FileUploadController({
  name,
  className,
  label,
}: FileUploadControllerProps) {
  const { control, getValues } = useFormContext();
  const initialUrl = getValues(name);
  const [touched, setTouched] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState }) => {
        const fileValue = field.value || null;

        // Check if it's an image
        const isImage =
          fileValue instanceof File
            ? fileValue.type.startsWith("image/")
            : typeof fileValue === "string"
              ? /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileValue)
              : !touched && initialUrl
                ? /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(initialUrl)
                : false;

        // preview URL
        const preview =
          fileValue instanceof File
            ? URL.createObjectURL(fileValue)
            : typeof fileValue === "string"
              ? fileValue
              : !touched
                ? initialUrl
                : null;

        // file change handler
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            // Validate file type
            if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
              alert(
                "Please select a valid image file (PNG, JPEG, JPG, WEBP, SVG)",
              );
              return;
            }
            setTouched(true);
            field.onChange(file);
          }
        };

        // delete file
        const handleDelete = () => {
          setTouched(true);
          field.onChange(null);
        };

        return (
          <div>
            <div
              className={cn(
                "  border border-dashed hover:border-dashboard-primary bg-[#F5F5F5] border-[#B0B0B0] rounded-lg cursor-pointer block relative",
                className,
              )}
            >
              {fileValue ? (
                isImage && preview ? (
                  // Image preview
                  <div className="w-full h-full relative group">
                    <button
                      onClick={handleDelete}
                      className="absolute w-6 h-6 flex items-center justify-center rounded-full p-1 -right-2 -top-2 z-10 bg-red-600 cursor-pointer "
                      aria-label="Delete image"
                      type="button"
                    >
                      <X className="w-4 h-4 text-white  " />
                    </button>
                    <Image
                      width={800}
                      height={720}
                      src={preview}
                      alt="Preview"
                      className="w-full h-full  aspect-4/3  rounded-lg"
                      onLoad={() => {
                        // Revoke object URL to avoid memory leaks
                        if (fileValue instanceof File) {
                          URL.revokeObjectURL(preview);
                        }
                      }}
                    />
                  </div>
                ) : (
                  // Invalid file type
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 relative">
                    <button
                      onClick={handleDelete}
                      className="absolute w-6 h-6 flex items-center justify-center bg-dashboard-primary hover:bg-dashboard-primary rounded-full p-1 -right-2 -top-2"
                      aria-label="Delete file"
                      type="button"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="text-rose-500 text-center">
                      <label
                        htmlFor={`${name}-file`}
                        className="  cursor-pointer "
                      >
                        <input
                          id={`${name}-file`}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <X className="w-10 h-10 mx-auto" />
                        <p className="text-sm font-normal mt-2">
                          Invalid file type
                        </p>
                        <p className="text-xs">Please select an image</p>
                      </label>
                    </div>
                  </div>
                )
              ) : (
                // Upload placeholder
                <label
                  htmlFor={`${name}-file`}
                  className="flex flex-col items-center justify-center h-full lg:gap-2 cursor-pointer select-none  "
                >
                  {/* <Image
                    width={36}
                    height={36}
                    src={plaveholderGalleryImg}
                    alt="Upload image  "
                    className=" rounded-md  "
                  /> */}
                  <span>Placeholder image!!!</span>
                  <span className="text-grayDark lg:text-[#A6A6A6] text-xs font-poppins font-normal text-center px-2">
                    {label || "Upload image (PNG, JPEG, JPG, WEBP, SVG)"}
                  </span>
                  <input
                    id={`${name}-file`}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            {fieldState.error && (
              <p className="text-rose-500 text-xs mt-1 pl-2">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
