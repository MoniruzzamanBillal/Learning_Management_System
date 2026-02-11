import Cookies from "js-cookie";

export const getCookies = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return Cookies.get(key);
};
