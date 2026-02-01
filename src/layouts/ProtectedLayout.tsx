import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { AppLayout } from "./AppLayout";

export function ProtectedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}
