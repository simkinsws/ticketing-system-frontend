import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuthStore, type UserRole } from "../store/authStore";

export const useAuthInit = () => {
  const { setAuth, clearAuth, authInitialized, isAuthenticated } = useAuthStore();
  const initAttemptedRef = useRef(false);

  const { data, isError, isPending, isSuccess, refetch } = useQuery({
    queryKey: ["/auth/me"],
    queryFn: async () => {
      const response = await http.get("/auth/me");
      return response.data;
    },
    retry: false,
    staleTime: Infinity,
    enabled: false,
  });

  // Phase 1: If auth is already persisted and initialized, trust it
  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      console.log("[useAuthInit] Using persisted auth state");
      alert(`[AUTH] Using stored auth - User ID: ${authInitialized}`);
      // Verify in background silently
      if (!initAttemptedRef.current) {
        initAttemptedRef.current = true;
        refetch();
      }
      return;
    }

    // First time - fetch from server
    if (!initAttemptedRef.current && !authInitialized) {
      initAttemptedRef.current = true;
      console.log("[useAuthInit] Fetching auth state from server");
      alert("[AUTH] First time - fetching from server...");
      refetch();
    }
  }, [authInitialized, isAuthenticated, refetch]);

  // Phase 2: Handle query results
  useEffect(() => {
    if (isPending) return;

    console.log("[useAuthInit] Query resolved:", { data, isError, isSuccess });
    alert(`[AUTH] Query result - Success: ${isSuccess}, Error: ${isError}, Data: ${data ? "YES" : "NO"}`);

    if (isSuccess && data) {
      console.log("[useAuthInit] Setting auth with user:", data.userId);
      alert(`[AUTH] ✅ Setting auth - User: ${data.userId}`);
      setAuth(
        data.userId,
        data.roles as UserRole[],
        data.displayName,
        data.email
      );
      return;
    }

    if (isError) {
      console.log("[useAuthInit] Auth verification failed, clearing auth");
      alert(`[AUTH] ❌ Verification failed - Clearing auth`);
      clearAuth();
    }
  }, [data, isError, isSuccess, isPending, setAuth, clearAuth]);

  return { isPending: isPending || !authInitialized };
};
