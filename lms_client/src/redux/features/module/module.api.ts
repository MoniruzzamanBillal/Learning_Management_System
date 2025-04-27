import { baseApi } from "@/redux/api/baseApi";

const moduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //
    // ! for adding a module
    addModule: builder.mutation({
      query: (payload) => {
        return {
          url: "/module/add-module",
          method: "POST",
          body: payload,
        };
      },
    }),

    //
  }),
});

//
export const { useAddModuleMutation } = moduleApi;
