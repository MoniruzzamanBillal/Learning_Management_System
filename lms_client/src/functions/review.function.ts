/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleToastResponse } from "@/utils/sharedFunction";
import { toast } from "sonner";

// ! for giving a review
export const giveReviewFunction = async (payload: any, giveReview: any) => {
  const taostId = toast.loading("Giving Review....");

  try {
    const result = await giveReview(payload);

    const responseResult = handleToastResponse(result, taostId);
    return responseResult;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while giving review  !!!", {
      duration: 1400,
    });
  }
};

// ! for updating a review
export const updateReviewFunction = async (payload: any, updateReview: any) => {
  const taostId = toast.loading("Updating Review....");

  try {
    const result = await updateReview(payload);

    const responseResult = handleToastResponse(result, taostId);
    return responseResult;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while updating review  !!!", {
      duration: 1400,
    });
  }
};
