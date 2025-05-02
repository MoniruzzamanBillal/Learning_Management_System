import { baseApi } from "@/redux/api/baseApi";

const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting enrollment info for each course
    getEnrollmentInfo: builder.query({
      query: () => {
        return {
          url: `/enroll/enrollment-data`,
          method: "GET",
        };
      },
    }),

    //
  }),
});

//

export const { useGetEnrollmentInfoQuery } = enrollmentApi;
