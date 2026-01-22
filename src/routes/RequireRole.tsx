import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore, type UserRole } from "../store/authStore";

interface RequireRoleProps {
  allowedRoles: UserRole[];
}

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const { isAuthenticated, authInitialized, roles } = useAuthStore();
  const location = useLocation();

  // Wait for auth to be checked before redirecting
  if (!authInitialized) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasRequiredRole = roles.some((role) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
