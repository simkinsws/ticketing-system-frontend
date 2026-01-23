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
    console.log("[useAuthInit] Query state:", { data, isError, isSuccess, isPending });
    
    if (isSuccess && data) {
      console.log("[useAuthInit] Setting auth with user:", data.userId);
      setAuth(
        data.userId,
        data.roles as UserRole[],
        data.displayName,
        data.email
      );
      return;
    }

    if (isError || (isSuccess && !data)) {
      console.log("[useAuthInit] Clearing auth - isError:", isError, "no data:", !data);
      clearAuth();
    }
  }, [data, isError, isSuccess, setAuth, clearAuth]);

  return { isPending: isPending || !authInitialized };
};
