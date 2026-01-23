import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:54166";

console.log("[API] Base URL:", apiBaseUrl);
console.log("[API] All env vars:", import.meta.env);

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  return config;
});
