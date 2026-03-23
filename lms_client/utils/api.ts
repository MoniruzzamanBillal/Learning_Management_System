/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axiosInstance";

export const apiGet = async (endPoint: string) => {
  const { data } = await axiosInstance.get(endPoint);
  return data;
};

export const apiPost = async (endPoint: string, payLoad: any) => {
  const { data } = await axiosInstance.post(endPoint, payLoad);
  return data;
};

export const apiPut = async (endPoint: string, payLoad: any) => {
  const { data } = await axiosInstance.put(endPoint, payLoad);
  return data;
};
export const apiPatch = async (endPoint: string, payLoad: any) => {
  const { data } = await axiosInstance.patch(endPoint, payLoad);
  return data;
};

export const apiDelete = async (endPoint: string) => {
  const { data } = await axiosInstance.delete(endPoint);
  return data;
};
