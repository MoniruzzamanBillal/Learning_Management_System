// ! main base url
export const baseURL = "http://localhost:5000";

export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || `${baseURL}/api`;
};
