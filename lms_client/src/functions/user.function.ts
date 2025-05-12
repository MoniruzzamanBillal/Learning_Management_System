/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleToastResponse } from "@/utils/sharedFunction";
import { toast } from "sonner";

// ! for updating a user
export const updateUserFunction = async (
  formData: any,
  updateUser: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Updating User....");

  try {
    const result = await updateUser(formData);

    await handleToastResponse(result, taostId, navigate);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while adding course !!!", {
      duration: 1400,
    });
  }
};
