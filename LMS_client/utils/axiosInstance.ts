import { authKey, refreshTokenKey, userIdKey } from "@/constants/storageKey";

import { getBaseUrl } from "@/config/envConfig";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getCookies } from "./GetCookies";

const instance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.timeout = 60000;

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    // <========
    // If the request is a POST request and the data is not FormData,
    // set Content-Type to application/json
    // ========>
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // Let the browser set the correct multipart boundary
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // Skip adding Authorization header for login endpoint
    if (!config.url?.includes("/auth/signing")) {
      const accessToken = getCookies(authKey);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  // ✅ Handle success
  //@ts-expect-error: response type is not always consistent
  function (response) {
    return {
      data: response?.data,
      meta: response?.data?.meta,
    };
  },

  // ❌ Handle errors
  async function (error) {
    const originalRequest = error.config;

    // console.log("-----");
    // console.log("-----");
    // console.log("line = 64");
    // console.log("error from axiosInstance = ", error);
    // console.log("-----");
    // console.log("-----");

    // !
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookies(refreshTokenKey);

        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          { refreshToken },
          { withCredentials: true },
        );

        console.log(
          "response from axiosinstance line 88 = ",
          response?.data?.data?.accessToken,
        );

        Cookies.set(authKey, response?.data?.data?.accessToken, {
          expires: 1,
        });

        originalRequest.headers.Authorization = `Bearer ${response?.data?.data?.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        console.log("refreshError from axiosinstance line 94 = ", refreshError);

        Cookies.remove(authKey);
        Cookies.remove(refreshTokenKey);
        Cookies.remove(userIdKey);
        toast.error("Session Expired , Login to continue.");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }
    // !

    // Handle 403
    if (error?.response?.status === 403) {
      toast.error("You do not have permission to access this resource");
      return Promise.reject(error);
    }

    // Generic Error Handler
    const errorObj = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Something went wrong",
      errorMessages: error?.response?.data?.message,
      errors: error?.response?.data?.errors,
    };

    // toast.error("Session Expired , Login to continue.");

    // console.log("errorObj = ", errorObj);

    // toast.error(errorObj.message);
    return Promise.reject(errorObj);
  },
);
export { instance as axiosInstance };
