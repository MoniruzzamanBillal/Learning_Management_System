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
    // ! for register an instructor
    instructorRegistration: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/register-instructor",
          method: "POST",
          body: payload,
        };
      },
    }),

    changePassword: builder.mutation({
      query: (payload) => {
        return {
          url: "/user/change-password",
          method: "PATCH",
          body: payload,
        };
      },
    }),

    //
  }),

  //
});

//
export const {
  useLogInMutation,
  useUserRegistrationMutation,
  useChangePasswordMutation,
  useInstructorRegistrationMutation,
} = authApi;
