import { baseApi } from "@/redux/api/baseApi";

const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //

    // ! for adding new video
    addNewVideo: builder.mutation({
      query: (payload) => {
        return {
          url: "/video/add-video",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for updating video
    updateVideo: builder.mutation({
      query: ({ formData, videoId }) => {
        return {
          url: `/video/update-video/${videoId}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // ! for getting individual video
    getSingleVideo: builder.query({
      query: (videoId: string) => {
        return {
          url: `/video/individual-video/${videoId}`,
          method: "GET",
        };
      },
    }),

    //
  }),
});

//
export const {
  useAddNewVideoMutation,
  useUpdateVideoMutation,
  useGetSingleVideoQuery,
} = videoApi;
