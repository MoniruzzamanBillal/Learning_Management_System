import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting logged in user
    getLoggedInUser: builder.query({
      query: () => {
        return {
          url: "/user/loggedIn-user",
          method: "GET",
        };
      },
    }),

    //
  }),
});

//

export const { useGetLoggedInUserQuery } = userApi;
