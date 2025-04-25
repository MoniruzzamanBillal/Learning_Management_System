import { baseApi } from "@/redux/api/baseApi";

const instructorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting all instructor
    getAllInstructor: builder.query({
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
export const { useGetAllInstructorQuery } = instructorApi;
