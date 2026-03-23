import { authKey } from "@/constants/storageKey";
import { userRoleConts } from "@/utils/constants";
import { getCookies } from "@/utils/GetCookies";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  userId: string;
  userRole: keyof typeof userRoleConts;
  profileImage?: string;
  iat: number;
  exp: number;
}

export const useGetUser = () => {
  const accessToken = getCookies(authKey);

  if (accessToken) {
    const decode = jwtDecode<DecodedToken>(accessToken);

    return decode;
  }

  return null;
};
