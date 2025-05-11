import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting course review
    getCourseReview: builder.query({
      query: (courseId) => {
        return {
          url: `/review/course-review/${courseId}`,
          method: "GET",
        };
      },
    }),

    // ! check review eligibility
    checkReviewEligibility: builder.query({
      query: (courseId) => {
        return {
          url: `/review/check-review-eligibility/${courseId}`,
          method: "GET",
        };
      },
    }),

    //
  }),
});

//

export const { useGetCourseReviewQuery, useCheckReviewEligibilityQuery } =
  reviewApi;
