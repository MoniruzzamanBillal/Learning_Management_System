import { deleteAllCookies, refreshDelete } from "@/actions/cookiesAction";
import { getBaseUrl } from "@/config/envConfig";

import { authKey } from "@/constants/storageKey";
import axios from "axios";
import Cookies from "js-cookie";

import { decodedToken } from "./jwt";
import { getCookies } from "@/utils/GetCookies";

// export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
//   return setToLocalStorage(authKey , accessToken as string);
// };

export const getUserInfo = () => {
  const authToken = getCookies(authKey);

  if (authToken) {
    const decodedData = decodedToken(String(authToken)) as any;
    return decodedData;
  } else {
    return "";
  }
};

// export const isLoggedIn = () => {
//   const authToken = getFromLocalStorage(authKey);
//   return !!authToken;
// };

// export const removeUserInfo = (key: string) => {
//   return localStorage.removeItem(key);
// };

export async function logout() {
  // Delete the refresh token from cookies
  await refreshDelete();
  await deleteAllCookies();
}

export const getNewAccessToken = async () => {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token expired");
  }

  const response = await axios.post(
    `${getBaseUrl()}/auth/refresh-token`,
    {
      refreshToken: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // console.log(response);
  console.log("response from getNewAccessToken = ", response);

  return response.data;
};
