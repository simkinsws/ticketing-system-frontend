import { useMutation } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuthStore, type UserRole } from "../store/authStore";
import type { LoginFormInputs } from "../types/auth";

export const useLoginApi = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: async (credentials: LoginFormInputs) => {
      return await http.post("/auth/login", credentials);
    },
    onSuccess: (response) => {
      const { user } = response.data;
      setAuth(user.id, user.roles as UserRole[], user.displayName, user.email);
    },
  });
};
