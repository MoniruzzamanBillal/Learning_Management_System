import { axiosInstance } from "@/utils/axiosInstance";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    // console.log("login function called", credentials);
    const response = await axiosInstance.post("/auth/login", credentials);
    // console.log("response", response);

    return response.data;
  },

  // registration: async (credentials: RegistrationForm) => {
  //   // console.log("registration function called in auth service", credentials);

  //   const response = await axiosInstance.post("/auth/signup", credentials);

  //   // console.log("response in auth service registration  ", response);

  //   return response.data;
  // },
};

export const postService = {
  request: async (
    endpoint: string,
    data: FormData | Record<string, unknown>,
  ) => {
    // console.log(`Requesting ${endpoint} with data:`, data);
    const response = await axiosInstance.post(endpoint, data);
    // console.log("Response:", response);
    return response.data;
  },

  patch: async (endpoint: string, data: Record<string, unknown> | FormData) => {
    console.log(`PATCH Request to ${endpoint} with data:`, data);
    const response = await axiosInstance.patch(endpoint, data);
    // console.log("Response:", response);
    return response.data;
  },
};
export const deleteService = {
  delete: async (endpoint: string) => {
    // console.log(`Requesting ${endpoint}`);
    const response = await axiosInstance.delete(endpoint);
    // console.log("Response:", response);
    return response.data;
  },
};
