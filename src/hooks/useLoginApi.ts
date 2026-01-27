import { useMutation } from "@tanstack/react-query";
import { http, setAuthToken } from "../api/http";
import { useAuthStore, type UserRole } from "../store/authStore";
import type { LoginFormInputs } from "../types/auth";

export const useLoginApi = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: async (credentials: LoginFormInputs) => {
      return await http.post("/auth/login", credentials);
    },
    onSuccess: (response) => {
      try {
        const { user, accessToken } = response.data;
        console.log("Login response received:", { user, hasAccessToken: !!accessToken });
        
        // Store token for Authorization header
        if (accessToken) {
          console.log("Setting auth token to localStorage...");
          setAuthToken(accessToken);
          console.log("Auth token set successfully");
        } else {
          console.warn("No accessToken in response!");
        }
        
        console.log("Calling setAuth with user:", user.id);
        setAuth(user.id, user.roles as UserRole[], user.displayName, user.email);
        console.log("Auth state updated successfully");
      } catch (error) {
        console.error("Error in login onSuccess:", error);
      }
    },
  });
};
