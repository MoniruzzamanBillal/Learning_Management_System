import { baseApi } from "@/redux/api/baseApi";

const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for adding course
    addNewCourse: builder.mutation({
      query: (payload) => {
        return {
          url: "/course/add-course",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["fetchAdminCourse"],
    }),

    // ! for updating course
    updateCourse: builder.mutation({
      query: ({ formData, courseId }) => {
        return {
          url: `/course/update-course/${courseId}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["fetchAdminCourse"],
    }),

    // ! for getting admin single course
    getCourseDetailsForAdmin: builder.query({
      query: (courseId: string) => {
        return {
          url: `/course/admin-course-detail/${courseId}`,
          method: "GET",
        };
      },
    }),

    // ! for getting instructor single course detail
    getCourseDetailsForInstructor: builder.query({
      query: (courseId: string) => {
        return {
          url: `/course/instructor-course-detail/${courseId}`,
          method: "GET",
        };
      },
    }),

    // ! for getting instructor assigned courses
    getInstructorAssignedCourse: builder.query({
      query: (instructorId: string) => {
        return {
          url: `/course/instructor-courses/${instructorId}`,
          method: "GET",
        };
      },
    }),

    // ! for getting all admin course
    getAllCourseAdmin: builder.query({
      query: () => {
        return {
          url: `/course/admin-all-courses`,
          method: "GET",
        };
      },
      providesTags: ["fetchAdminCourse"],
    }),

    // ! for getting course for admin and instructors
    getAllCourseWithModule: builder.query({
      query: () => {
        return {
          url: `/course/all-courses-modules`,
          method: "GET",
        };
      },
      providesTags: ["fetchAllCourseWithModule"],
    }),

    // ! for publishing a course
    publishCourse: builder.mutation({
      query: (courseId: string) => {
        return {
          url: `/course/publish-course/${courseId}`,
          method: "PATCH",
        };
      },
    }),

    // ! for getting all course ( published course )
    getAllPublishedCorses: builder.query({
      query: () => {
        return {
          url: `/course/all-courses`,
          method: "GET",
        };
      },
    }),

    // ! for getting single course data
    getCouseDetail: builder.query({
      query: (courseId) => {
        return {
          url: `/course/course-detail/${courseId}`,
          method: "GET",
        };
      },
    }),

    //
  }),
});

//
export const {
  useAddNewCourseMutation,
  useUpdateCourseMutation,
  useGetCourseDetailsForAdminQuery,
  useGetInstructorAssignedCourseQuery,
  useGetAllCourseAdminQuery,
  useGetAllCourseWithModuleQuery,
  useGetCourseDetailsForInstructorQuery,
  usePublishCourseMutation,
  useGetAllPublishedCorsesQuery,
  useGetCouseDetailQuery,
} = courseApi;
