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

    //
  }),
});

//
export const {
  useAddNewCourseMutation,
  useUpdateCourseMutation,
  useGetCourseDetailsForAdminQuery,
} = courseApi;
