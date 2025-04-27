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

    // ! for updating module
    updateModule: builder.mutation({
      query: ({ payload, moduleId }) => {
        return {
          url: `/module/update-module/${moduleId}`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    //
  }),
});

//
export const { useAddModuleMutation, useUpdateModuleMutation } = moduleApi;
