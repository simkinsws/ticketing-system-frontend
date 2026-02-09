import { useMutation } from "@tanstack/react-query";
import { http, setAuthTokens } from "../../api/core/http";
import { useAuthStore, type UserRole } from "../../store/authStore";
import type { LoginFormInputs } from "../../types/auth";

export const useLoginApi = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: async (credentials: LoginFormInputs) => {
      const response = await http.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data, credentials) => {
      try {
        const { user, accessToken, refreshToken } = data;

        // Store token for Authorization header
        if (accessToken && refreshToken) {
          setAuthTokens(accessToken, refreshToken, credentials.rememberMe);
        } else {
          console.warn("Missing tokens in response!");
        }

        setAuth(
          user.id,
          user.roles as UserRole[],
          user.displayName,
          user.email,
        );
      } catch (error) {
        console.error("Error in login onSuccess:", error);
      }
    },
  });
};
