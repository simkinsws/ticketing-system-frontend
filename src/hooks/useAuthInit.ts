import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuthStore, type UserRole } from "../store/authStore";
import axios from "axios";

export const useAuthInit = () => {
  const { setAuth, clearAuth, hasHydrated, isAuthenticated, userId } =
    useAuthStore();

  const initAttemptedRef = useRef(false);
  const [initAttempted, setInitAttempted] = useState(false);

  const { data, error, isError, isPending, isSuccess, refetch, status } =
    useQuery({
      queryKey: ["/auth/me"],
      queryFn: async () => {
        alert(
          `[AUTH] /auth/me request url=${http.defaults.baseURL ?? "(no baseURL)"}`,
        );

        const response = await http.get("/auth/me");
        return response.data;
      },
      retry: false,
      staleTime: Infinity,
      enabled: false,
    });

  // Phase 1: wait for persist hydration first
  useEffect(() => {
    if (!hasHydrated) {
      alert("[AUTH] ⏳ Waiting for hydration...");
      return;
    }

    alert(
      `[AUTH] ✅ Hydration ready. isAuthenticated=${isAuthenticated} userId=${userId ?? "none"}`,
    );

    const attemptOnce = () => {
      if (initAttemptedRef.current) return;
      initAttemptedRef.current = true;
      setInitAttempted(true);

      alert("[AUTH] 🔄 Calling /auth/me ...");
      refetch();
    };

    if (isAuthenticated) {
      alert(`[AUTH] Using stored auth - User ID: ${userId ?? "unknown"}`);
      alert("[AUTH] Background verify /auth/me ...");
      attemptOnce();
      return;
    }

    alert("[AUTH] No stored auth - fetching from server...");
    attemptOnce();
  }, [hasHydrated, isAuthenticated, userId, refetch]);

  // Phase 2: Handle query results (with status code)
  useEffect(() => {
    if (status === "pending") return;

    if (isSuccess && data) {
      alert(`[AUTH] ✅ /auth/me success - User: ${data.userId}`);
      setAuth(
        data.userId,
        data.roles as UserRole[],
        data.displayName,
        data.email,
      );
      return;
    }

    if (isError) {
      let statusCode: number | undefined;
      let message = "unknown error";

      if (axios.isAxiosError(error)) {
        statusCode = error.response?.status;
        message =
          error.response?.data?.message ??
          error.message ??
          "axios error with no message";
      } else if (error instanceof Error) {
        message = error.message;
      }

      alert(
        `[AUTH] ❌ /auth/me failed. status=${statusCode ?? "none"} message=${message}`,
      );

      // ✅ Only clear auth on real "not authenticated"
      if (statusCode === 401 || statusCode === 403) {
        alert("[AUTH] ❌ Not authenticated (401/403) -> clearing auth");
        clearAuth();
      } else {
        // Keep stored auth, because failure might be network/cors/server
        alert(
          "[AUTH] ⚠️ Keeping stored auth (not 401/403). Likely cookies/credentials/CORS/network.",
        );
      }
    }
  }, [status, isSuccess, isError, data, error, setAuth, clearAuth]);

  const initializing = !hasHydrated || (initAttempted && isPending);
  return { isPending: initializing };
};
