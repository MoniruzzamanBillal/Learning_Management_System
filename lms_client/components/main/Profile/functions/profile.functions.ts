/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

// ! for updating the logged-in user's profile
export const updateProfileFunction = async (
  formData: any,
  updateProfile: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Updating Profile....");

  try {
    const result = await updateProfile({
      url: "/user/update-user",
      payload: formData,
    });

    toast.success(result?.message || "Profile updated successfully", {
      id: taostId,
      duration: 1000,
    });
    setTimeout(() => navigate(), 700);
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error?.message ||
      "Something went wrong while updating profile !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};
