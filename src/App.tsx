import { Route, Routes, useLocation } from "react-router";
import { useAuthInit } from "./hooks/state/useAuthInit";
import { useAuthStore } from "./store/authStore";
import { RequireRole } from "./routes/RequireRole";
import { RootRedirect } from "./routes/RootRedirect";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { ConfirmEmail } from "./pages/Auth/ConfirmEmail";
import NotFound from "./pages/Auth/NotFound";
import BasicTable from "./components/shared/Table/BasicTable";
import AdminSupportChat from "./pages/Admin/AdminSupportChat";
import { CustomerChatWidget } from "./components/CustomerChatWidget/CustomerChatWidget";
import { CustomerProfileSettings } from "./pages/Customer/CustomerProfileSettings";
import loaderWebp from "./assets/ticket_loader.webp";
import "./App.css";
export default function App() {
  const { isPending } = useAuthInit();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const roles = useAuthStore((s) => s.roles);
  const location = useLocation();
  const hideChatWidget = location.pathname === "/unauthorized";

  if (isPending) {
    return (
      <div className="loader-container">
        <img src={loaderWebp} alt="Loading..." width={200} height={200} />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/unauthorized" element={<div>Access Denied</div>} />

        <Route element={<ProtectedLayout />}>
          <Route element={<RequireRole allowedRoles={["Customer"]} />}>
            <Route
              path="/customer/dashboard"
              element={<div>Customer Dashboard</div>}
            />
            <Route
              path="/customer/profile"
              element={<CustomerProfileSettings />}
            />
          </Route>

          <Route element={<RequireRole allowedRoles={["Admin"]} />}>
            <Route path="/admin/dashboard" element={<BasicTable />} />
          </Route>
        </Route>
        
        <Route element={<RequireRole allowedRoles={["Admin"]} />}>
          <Route path="/admin/chat" element={<AdminSupportChat />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isAuthenticated && roles.includes("Customer") && !hideChatWidget ? (
        <CustomerChatWidget />
      ) : null}
    </>
  );
}
