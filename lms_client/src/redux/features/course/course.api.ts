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

    // ! for getting instructor assigned courses
    getInstructorAssignedCourse: builder.query({
      query: (instructorId: string) => {
        return {
          url: `/course/instructor-courses/${instructorId}`,
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
} = courseApi;
