/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/redux/hook";
import { TUser } from "@/types/globalTypes";
import { toast } from "sonner";
import { verifyToken } from "./verifyToken";

export const useGetUser = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user;
};

export const GetUserRole = () => {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return;
  }

  const user = verifyToken(token) as TUser;

  return user?.userRole;
};

export const handleToastResponse = (
  result: any,
  toastId: string | number,
  navigate?: () => void
) => {
  if (result?.error) {
    const errorMessage = (result?.error as any)?.data?.message;
    console.log(errorMessage);
    toast.error(errorMessage, {
      id: toastId,
      duration: 1400,
    });
    return;
  }

  if (result?.data) {
    const successMsg = result?.data?.message;
    toast.success(successMsg, {
      id: toastId,
      duration: 1000,
    });

    if (navigate) {
      setTimeout(() => {
        navigate();
      }, 700);
    }

    return result;
  }
};
