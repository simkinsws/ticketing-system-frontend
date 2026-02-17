import { useEffect, useRef, useState } from "react";
import { useAuthStore, type UserRole } from "../../store/authStore";
import { useAuthMeApi } from "../api/useAuthMeApi";
import axios from "axios";

export const useAuthInit = () => {
  const { setAuth, clearAuth, hasHydrated, isAuthenticated, userId } =
    useAuthStore();

  const initAttemptedRef = useRef(false);
  const [initAttempted, setInitAttempted] = useState(false);

  const { data, error, isError, isPending, isSuccess, refetch, status } =
    useAuthMeApi();

  // Phase 1: wait for persist hydration first
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const attemptOnce = () => {
      if (initAttemptedRef.current) return;
      initAttemptedRef.current = true;
      setInitAttempted(true);

      refetch();
    };

    if (isAuthenticated) {
      attemptOnce();
      return;
    }

    attemptOnce();
  }, [hasHydrated, isAuthenticated, userId, refetch]);

  // Phase 2: Handle query results (with status code)
  useEffect(() => {
    if (status === "pending") return;

    if (isSuccess && data) {
      setAuth(data.id, data.roles as UserRole[], data.displayName, data.email);
      return;
    }

    if (isError) {
      let statusCode: number | undefined;

      if (axios.isAxiosError(error)) {
        statusCode = error.response?.status;
      }

      // ✅ Only clear auth on real "not authenticated"
      if (statusCode === 401 || statusCode === 403) {
        clearAuth();
      }
    }
  }, [status, isSuccess, isError, data, error, setAuth, clearAuth]);

  const initializing = !hasHydrated || (initAttempted && isPending);
  return { isPending: initializing };
};
