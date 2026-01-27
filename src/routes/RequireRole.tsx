import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore, type UserRole } from "../store/authStore";

interface RequireRoleProps {
  allowedRoles: UserRole[];
}

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const { hasHydrated, isAuthenticated, roles } = useAuthStore();
  const location = useLocation();

  if (!hasHydrated) {
    return <div>Loading...</div>;
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
