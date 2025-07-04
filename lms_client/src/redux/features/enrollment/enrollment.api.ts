import { baseApi } from "@/redux/api/baseApi";

const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! enroll into a course
    enrollInCourse: builder.mutation({
      query: (payload) => {
        return {
          url: `/enroll/enroll-course`,
          method: "POST",
          body: payload,
        };
      },
    }),

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

    // ! based on module id , find video data for enrolled user
    getEnrolledCourseVideoModuleId: builder.query({
      query: (moduleId) => {
        return {
          url: `/enroll/module-videos/${moduleId}`,
          method: "GET",
        };
      },
    }),

    // ! for watching video of enrolled course
    getEnrolledCourseVideo: builder.query({
      query: (videoId) => {
        return {
          url: `/enroll/my-enrolled-course-videos/${videoId}`,
          method: "GET",
        };
      },
    }),

    // ! for getting course progress data
    getUserCourseProgress: builder.query({
      query: (courseId) => {
        return {
          url: `/enroll/my-course-progress/${courseId}`,
          method: "GET",
        };
      },
    }),

    // ! for checking user enrolled a coure or not
    getCheckUserEnrolledInCourse: builder.query({
      query: (courseId) => {
        return {
          url: `/enroll/check-user-enrolled/${courseId}`,
          method: "GET",
        };
      },
    }),

    //  ! for marking course as complete
    markCompleteCourse: builder.mutation({
      query: (courseId) => {
        return {
          url: `/enroll/complete-my-course/${courseId}`,
          method: "PATCH",
        };
      },
    }),

    // ! get user's finished course
    getUserFinishCourse: builder.query({
      query: () => {
        return {
          url: `/enroll/user-finished-course`,
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
  useLazyGetEnrolledCourseVideoModuleIdQuery,
  useLazyGetEnrolledCourseVideoQuery,
  useEnrollInCourseMutation,
  useLazyGetUserCourseProgressQuery,
  useMarkCompleteCourseMutation,
  useGetCheckUserEnrolledInCourseQuery,
  useGetUserFinishCourseQuery,
} = enrollmentApi;
