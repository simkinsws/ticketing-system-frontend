import { Route, Routes } from "react-router";
import { useAuthInit } from "./hooks/useAuthInit";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { RequireRole } from "./routes/RequireRole";
import BasicTable from "./components/shared/Table/BasicTable";
import { RootRedirect } from "./routes/RootRedirect";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import loaderWebp from "./assets/ticket_loader.webp";
import "./App.css";
import NotFound from "./pages/Auth/NotFound";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import AdminSupportChat from "./pages/Admin/AdminSupportChat";
import { CustomerChatWidget } from "./components/CustomerChatWidget/CustomerChatWidget";
export default function App() {
  const { isPending } = useAuthInit();
  const { isAuthenticated, roles } = useAuthStore();

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

        {/* Customer routes */}
        <Route element={<RequireRole allowedRoles={["Customer"]} />}>
          <Route
            path="/customer/dashboard"
            element={<div>Customer Dashboard</div>}
          />
        </Route>

        {/* Admin-only routes */}
        <Route element={<RequireRole allowedRoles={["Admin"]} />}>
          <Route path="/admin/dashboard" element={<BasicTable />} />
          <Route path="/admin/chat" element={<AdminSupportChat />} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<div>Access Denied</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isAuthenticated && roles.includes("Customer") ? (
        <CustomerChatWidget />
      ) : null}
    </>
  );
}
