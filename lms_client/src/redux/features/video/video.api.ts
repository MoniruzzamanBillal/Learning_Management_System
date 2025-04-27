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

    //
  }),
});

//
export const { useAddNewVideoMutation } = videoApi;
