import axios from "axios";

export const http = axios.create({
  baseURL: "https://localhost:54166",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  return config;
});
