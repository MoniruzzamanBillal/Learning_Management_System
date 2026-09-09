/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiPost } from "@/lib/api";
import { handleToastResponse } from "@/utils/sharedFunction";
import { toast } from "sonner";

type TVideoUploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};

// ! uploads a video file directly from the browser to Cloudinary using a
// short-lived signed credential from our backend, so the raw file bytes
// never pass through our own Vercel serverless function — which enforces a
// hard ~4.5MB request-body limit that made any real video upload fail with
// 413, regardless of file size (see
// lms_server/context/specs/40-video-upload-413-vercel-body-limit.md).
export const uploadVideoToCloudinary = async (
  file: File,
): Promise<{ videoUrl?: string; error?: boolean }> => {
  const taostId = toast.loading("Uploading video...");

  try {
    const signatureResponse = await apiPost("/video/upload-signature", {});
    const credential = signatureResponse?.data as TVideoUploadSignature;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", credential.apiKey);
    formData.append("timestamp", String(credential.timestamp));
    formData.append("signature", credential.signature);
    formData.append("folder", credential.folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${credential.cloudName}/video/upload`,
      { method: "POST", body: formData },
    );

    if (!uploadResponse.ok) {
      throw new Error("Video upload to Cloudinary failed");
    }

    const uploadResult = await uploadResponse.json();

    toast.success("Video uploaded", { id: taostId, duration: 1000 });

    return { videoUrl: uploadResult?.secure_url };
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while uploading the video !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    return { error: true };
  }
};

// ! for adding video
export const addVideoFunction = async (
  payload: any,
  AddVideo: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Adding New Video....");

  try {
    const result = await AddVideo({ url: "/video/add-video", payload });

    toast.success(result?.message || "Video added successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage = error?.message || "Something went wrong while adding video !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for update video
export const updateVideoFunction = async (
  formData: any,
  updateVideo: any,
  videoId: string,
  navigate: () => void
) => {
  const taostId = toast.loading("Updating Video....");

  try {
    const result = await updateVideo({ url: `/video/update-video/${videoId}`, payload: formData });

    toast.success(result?.message || "Video updated successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage = error?.message || "Something went wrong while updating video !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for delete video
export const deleteVideoFunction = async (params: any, deleteVideo: any) => {
  const taostId = toast.loading("Deleting Video....");

  try {
    const result = await deleteVideo(params);

    toast.success(result?.message || "Video deleted successfully", {
      id: taostId,
      duration: 1000,
    });
    return { data: { success: true } };
  } catch (error: any) {
    const errorMessage = error?.message || "Something went wrong while Deleting video !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    return { error: true };
  }
};
