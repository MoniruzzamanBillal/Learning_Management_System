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

    //
  }),
});

//
export const { useAddNewVideoMutation, useUpdateVideoMutation } = videoApi;
