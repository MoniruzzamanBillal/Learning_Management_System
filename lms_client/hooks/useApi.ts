import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/utils/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type TgenericResponse<TData> = {
  data: TData;
  statusCode: number;
  success: boolean;
  message: string;
};

type TFetchOptions<TData> = Omit<
  UseQueryOptions<TgenericResponse<TData>, Error>,
  "queryKey" | "queryFn"
>;

// ! updated useFetchHook with options - enabled , staleTime
export const useFetchData = <TData>(
  key: string[],
  endPoint: string,
  options?: TFetchOptions<TData>,
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
      payload: Record<string, unknown> | FormData | unknown;
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
    onError: (error: unknown) => {
      // console.log("error = ", error?.response?.data?.message);
      // toast.error(
      //   error?.response?.data?.message || error.message || "Failed to Add.",
      // );
      throw error;
    },
  });
};

// Update Hook
export const useUpdateData = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      url: string;
      payload: Record<string, unknown> | FormData | unknown;
    }) => apiPut(params.url, params.payload),
    onSuccess: () => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });
};

export const usePatch = (invalidateQueriesKeys?: Array<string[]>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      url: string;
      payload: Record<string, unknown> | FormData | unknown;
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
