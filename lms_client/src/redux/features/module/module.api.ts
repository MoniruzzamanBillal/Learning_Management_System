import { baseApi } from "@/redux/api/baseApi";

const moduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //

    // ! for getting all module data
    allModule: builder.query({
      query: () => {
        return {
          url: "/module/all-module",
          method: "GET",
        };
      },
    }),

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

    // ! for getting single module data
    getSingleModuleData: builder.query({
      query: (moduleId) => {
        return {
          url: `/module/module-detail/${moduleId}`,
          method: "GET",
        };
      },
    }),

    //
  }),
});

//
export const {
  useAddModuleMutation,
  useUpdateModuleMutation,
  useGetSingleModuleDataQuery,
  useAllModuleQuery,
} = moduleApi;
