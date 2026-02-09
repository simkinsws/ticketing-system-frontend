import axios, { type InternalAxiosRequestConfig } from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://localhost:54166";

const ACCESS_TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const TOKEN_STORAGE_KEY = "auth-token-storage";

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

type HttpConfig = InternalAxiosRequestConfig & {
  useMultipart?: boolean;
  skipAuthRefresh?: boolean;
  _retry?: boolean;
};

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const typedConfig = config as HttpConfig;
  if (typedConfig.useMultipart) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) throw new Error("Missing tokens");

  const response = await http.post(
    "/auth/refresh",
    { accessToken, refreshToken },
    { skipAuthRefresh: true } as HttpConfig,
  );

  const newAccessToken = response.data?.accessToken as string | undefined;
  const newRefreshToken = response.data?.refreshToken as string | undefined;
  if (!newAccessToken || !newRefreshToken)
    throw new Error("Refresh response missing tokens");

  setAuthTokensToActiveStorage(newAccessToken, newRefreshToken);
  return newAccessToken;
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config as HttpConfig | undefined;
    const status = error?.response?.status;

    if (!original || original.skipAuthRefresh || status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original);
    } catch (refreshError) {
      clearAuthTokens();
      localStorage.removeItem("auth-storage");
      return Promise.reject(refreshError);
    }
  },
);

const resolveStorage = (): Storage => {
  const preferred = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (preferred === "local") return localStorage;
  if (preferred === "session") return sessionStorage;

  if (localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY)) {
    return localStorage;
  }

  return sessionStorage;
};

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean,
) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_STORAGE_KEY, rememberMe ? "local" : "session");
};

const setAuthTokensToActiveStorage = (
  accessToken: string,
  refreshToken: string,
) => {
  const storage = resolveStorage();
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
