/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export const handleToastResponse = (
  result: any,
  toastId: string | number,
  navigate?: () => void,
) => {
  console.log(result);

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
