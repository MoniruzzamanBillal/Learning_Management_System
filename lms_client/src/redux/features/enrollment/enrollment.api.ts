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

    // ! for getting all user enrolled course
    getAllUserEnrolledCourses: builder.query({
      query: () => {
        return {
          url: `/enroll/user-all-enrolled-couses`,
          method: "GET",
        };
      },
    }),

    // ! for getting user's single enrolled course data
    getUserEnrolledCourseDetail: builder.query({
      query: (courseId) => {
        return {
          url: `/enroll/my-enrolled-course/${courseId}`,
          method: "GET",
        };
      },
    }),

    //
  }),
});

//

export const {
  useGetEnrollmentInfoQuery,
  useGetAllUserEnrolledCoursesQuery,
  useGetUserEnrolledCourseDetailQuery,
} = enrollmentApi;
