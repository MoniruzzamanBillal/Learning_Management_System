/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/utils/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type TFetchOptions = Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;

export const useFetchData = (
  key: string[],
  endPoint: string,
  options?: TFetchOptions,
) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiGet(endPoint),
    ...options,
  });
};

export const usePost = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      url: string;
      payload: Record<string, unknown> | FormData | any;
    }) => {
      return apiPost(params.url, params.payload);
    },
    onSuccess: (data) => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error: any) => {
      // console.log("error = ", error?.response?.data?.message);
      // toast.error(
      //   error?.response?.data?.message || error.message || "Failed to Add.",
      // );
      throw error;
    },
  });
};

// Update Hook
export const useUpdateData = (key: string[], endPoint: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => apiPut(endPoint, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

export const usePatch = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      url: string;
      payload: Record<string, unknown> | FormData;
    }) => {
      return apiPatch(params.url, params.payload);
    },
    onSuccess: () => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to update.");
      throw error;
    },
  });
};

export const useDeleteData = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { url: string }) => {
      return apiDelete(params?.url);
    },
    onSuccess: () => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to Delete");
      throw error;
    },
  });
};
