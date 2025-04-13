import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for login
    logIn: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for register
    userRegistration: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/register",
          method: "POST",
          body: payload,
        };
      },
    }),

    //
  }),

  //
});

//
export const { useLogInMutation, useUserRegistrationMutation } = authApi;
