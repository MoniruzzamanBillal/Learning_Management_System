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

    //
  }),
});

//
export const { useAddNewCourseMutation } = courseApi;
