/* eslint-disable @typescript-eslint/no-explicit-any */

import { TUser } from "@/types/globalTypes";
import { verifyToken } from "@/utils/verifyToken";
import { toast } from "sonner";

type TLoginPayload = {
  email: string;
  password: string;
};

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

    if (result?.success) {
      const token = result?.token;

      const user = verifyToken(token) as TUser;

      toast.success(result?.message, { id: toastId, duration: 1400 });

      return { user, token };
    }
  } catch (error: any) {
    const errorMsg = (error as any)?.data?.message;
    toast.error(errorMsg, { id: toastId, duration: 1800 });
    console.log(error);
  }
};
