import { authKey, refreshTokenKey, userIdKey } from "@/constants/storageKey";
import { authService } from "@/services/auth";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useAuth = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log("data in useauth = ", data?.data);

      Cookies.set(authKey, data?.data?.accessToken, { expires: 1 });
      Cookies.set(refreshTokenKey, data?.data?.refreshToken, { expires: 2 });
      Cookies.set(userIdKey, data?.data?.userId, { expires: 1 });

      if (data?.user) {
        toast.success("Logged in successfully");
      }

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error(error.message);
      throw error;
    },
  });
};
