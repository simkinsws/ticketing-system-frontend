import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export const RootRedirect = () => {
  const { hasHydrated, isAuthenticated, roles } = useAuthStore();

  if (!hasHydrated) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.includes("Admin"))
    return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/customer/dashboard" replace />;
};
