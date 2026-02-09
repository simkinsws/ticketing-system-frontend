import axios, { type InternalAxiosRequestConfig } from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://localhost:54166";

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

type MultipartConfig = InternalAxiosRequestConfig & {
  useMultipart?: boolean;
};

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const multipartConfig = config as MultipartConfig;
  if (multipartConfig.useMultipart) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export const setAuthToken = (token: string) => {
  localStorage.setItem("auth-token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("auth-token");
};
