import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseQuery = fetchBaseQuery({
//     baseUrl: "http://localhost:5000/api/v1",
//     credentials: "include",
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.token;

//       if (token) {
//         headers.set("authorization", token);
//       }

//       return headers;
//     },
//   });

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
