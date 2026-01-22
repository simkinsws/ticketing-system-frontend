import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export const RootRedirect = () => {
  const { isAuthenticated, authInitialized, roles } = useAuthStore();

  // Wait for auth to be initialized before redirecting
  if (!authInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles.includes("Admin"))
    return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/customer/dashboard" replace />;
};
