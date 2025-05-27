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

    // ! for getting single user
    getSingleUser: builder.query({
      query: (userId) => {
        return {
          url: `/user/get-user/${userId}`,
          method: "GET",
        };
      },
    }),

    // ! for update a user
    updateUser: builder.mutation({
      query: (payload) => {
        return {
          url: "/user/update-user",
          method: "PATCH",
          body: payload,
        };
      },
    }),

    // ! for getting all instructors
    getAllInstructors: builder.query({
      query: () => {
        return {
          url: "/user/get-instructors",
          method: "GET",
        };
      },
    }),

    //
  }),
});

//

export const {
  useGetLoggedInUserQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useGetAllInstructorsQuery,
} = userApi;
