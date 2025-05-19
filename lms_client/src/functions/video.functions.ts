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
    const result = await AddVideo(payload);

    console.log(result);

    handleToastResponse(result, taostId, navigate);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while adding video !!!", {
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
    const result = await updateVideo({ formData, videoId });

    handleToastResponse(result, taostId, navigate);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while updating video !!!", {
      duration: 1400,
    });
  }
};

// ! for delete video
export const deleteVideoFunction = async (payload: any, deleteVideo: any) => {
  const taostId = toast.loading("Deleting Video....");

  try {
    const result = await deleteVideo(payload);

    const responseResult = handleToastResponse(result, taostId);
    return responseResult;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while Deleting video !!!", {
      duration: 1400,
    });
  }
};
