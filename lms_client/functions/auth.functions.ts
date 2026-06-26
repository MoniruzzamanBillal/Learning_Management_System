/* eslint-disable @typescript-eslint/no-explicit-any */

import { TLoginPayload } from "@/types/auth.types";
import { TUser } from "@/types/user.types";
import { handleToastResponse } from "@/utils/sharedFunction";
import { verifyToken } from "@/utils/verifyToken";
import { toast } from "sonner";

// ! for login
export const authLogin = async (payload: TLoginPayload, logInFunction: any) => {
  const toastId = toast.loading("Loginng in...");

  try {
    const result = await logInFunction(payload);

    //  *  for any  error
    if (result?.error) {
      const errorMessage = (result?.error as any)?.data?.message;
      console.log(errorMessage);
      toast.error(errorMessage, {
        id: toastId,
        duration: 1400,
      });
    }

    if (result?.data?.success) {
      const token = result?.data?.token;

      const user = verifyToken(token) as TUser;

      toast.success(result?.data?.message, { id: toastId, duration: 1400 });

      return { user, token };
    }
  } catch (error: any) {
    const errorMsg = (error as any)?.data?.message;
    toast.error(errorMsg, { id: toastId, duration: 1800 });
    console.log(error);
  }
};

// ! for register
export const registerUser = async (
  payload: any,
  registerFun: any,
  navigate: () => void,
) => {
  const toastId = toast.loading("Registering a user.....");

  try {
    const result = await registerFun(payload);

    await handleToastResponse(result, toastId, navigate);
  } catch (error) {
    toast.error("Something went wrong while reistering a user !! ", {
      id: toastId,
      duration: 1400,
    });
    console.log(error);
  }
};

// ! for register an instructor
export const registerInstructorFunction = async (
  payload: any,
  instructorRegistration: any,
  navigate: () => void,
) => {
  const toastId = toast.loading("Registering an instructor.....");

  try {
    const result = await instructorRegistration({
      url: "/auth/register-instructor",
      payload,
    });

    toast.success(result?.message || "Instructor registered successfully", {
      id: toastId,
      duration: 1000,
    });
    setTimeout(() => navigate(), 700);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      "Something went wrong while registering an instructor !! ";
    toast.error(errorMessage, {
      id: toastId,
      duration: 1400,
    });
    console.log(error);
  }
};
