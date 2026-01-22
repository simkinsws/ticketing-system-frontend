import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuthStore, type UserRole } from "../store/authStore";

export const useAuthInit = () => {
  const { setAuth, clearAuth, authInitialized } = useAuthStore();

  const { data, isError, isPending, isSuccess } = useQuery({
    queryKey: ["/auth/me"],
    queryFn: async () => {
      const response = await http.get("/auth/me");
      return response.data;
    },
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setAuth(
        data.userId,
        data.roles as UserRole[],
        data.displayName,
        data.email
      );
      return;
    }

    if (isError || (isSuccess && !data)) {
      clearAuth();
    }
  }, [data, isError, isSuccess, setAuth, clearAuth]);

  return { isPending: isPending || !authInitialized };
};
