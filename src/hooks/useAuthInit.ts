import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuthStore, type UserRole } from "../store/authStore";

export const useAuthInit = () => {
  const { setAuth, clearAuth, hasHydrated, isAuthenticated, userId } =
    useAuthStore();

  const initAttemptedRef = useRef(false);
  const [initAttempted, setInitAttempted] = useState(false);

  const { data, isError, isPending, isSuccess, refetch, status } = useQuery({
    queryKey: ["/auth/me"],
    queryFn: async () => {
      const response = await http.get("/auth/me");
      return response.data;
    },
    retry: false,
    staleTime: Infinity,
    enabled: false,
  });

  // Phase 1: wait for persist hydration first (CRITICAL for iPhone)
  useEffect(() => {
    if (!hasHydrated) return;

    const attemptOnce = () => {
      if (initAttemptedRef.current) return;
      initAttemptedRef.current = true;
      setInitAttempted(true);
      refetch();
    };

    // If we already have persisted auth, trust it immediately
    if (isAuthenticated) {
      console.log("[useAuthInit] Using persisted auth state");
      alert(`[AUTH] Using stored auth - User ID: ${userId ?? "unknown"}`);

      // Optional background verify (only once)
      alert("[AUTH] Background verify /auth/me ...");
      attemptOnce();
      return;
    }

    // No persisted auth -> fetch once from server
    console.log("[useAuthInit] No stored auth, fetching from server");
    alert("[AUTH] No stored auth - fetching from server...");
    attemptOnce();
  }, [hasHydrated, isAuthenticated, userId, refetch]);

  // Phase 2: Handle query results
  useEffect(() => {
    if (status === "pending") return;

    console.log("[useAuthInit] Query finished:", { isSuccess, isError, data });
    alert(
      `[AUTH] Query finished - Success: ${isSuccess}, Error: ${isError}, Data: ${
        data ? "YES" : "NO"
      }`,
    );

    if (isSuccess && data) {
      alert(`[AUTH] ✅ Setting auth - User: ${data.userId}`);
      setAuth(
        data.userId,
        data.roles as UserRole[],
        data.displayName,
        data.email,
      );
      return;
    }

    if (isError) {
      alert("[AUTH] ❌ /auth/me failed - clearing auth");
      clearAuth();
    }
  }, [status, isSuccess, isError, data, setAuth, clearAuth]);

  // ✅ No ref access during render
  const initializing = !hasHydrated || (initAttempted && isPending);

  return { isPending: initializing };
};
