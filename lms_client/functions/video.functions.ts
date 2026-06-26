/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleToastResponse } from "@/utils/sharedFunction";
import { toast } from "sonner";

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
    const errorMessage = error?.response?.data?.message || "Something went wrong while adding video !!!";
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
    const errorMessage = error?.response?.data?.message || "Something went wrong while updating video !!!";
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
    const errorMessage = error?.response?.data?.message || "Something went wrong while Deleting video !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    return { error: true };
  }
};
