import { useMutation } from "@tanstack/react-query";
import { http, setAuthToken } from "../../api/core/http";
import { useAuthStore, type UserRole } from "../../store/authStore";
import type { LoginFormInputs } from "../../types/auth";

export const useLoginApi = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: async (credentials: LoginFormInputs) => {
      return await http.post("/auth/login", credentials);
    },
    onSuccess: (response) => {
      try {
        const { user, accessToken } = response.data;
        
        // Store token for Authorization header
        if (accessToken) {
          setAuthToken(accessToken);
        } else {
          console.warn("No accessToken in response!");
        }
        
        setAuth(user.id, user.roles as UserRole[], user.displayName, user.email);
      } catch (error) {
        console.error("Error in login onSuccess:", error);
      }
    },
  });
};
