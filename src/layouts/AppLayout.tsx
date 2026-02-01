import { Outlet } from "react-router";
import { useUiStore } from "../store/uiStore";
import { useIsMobile } from "../hooks/ui/useIsMobile";
import "./AppLayout.scss";

export const AppLayout = () => {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.sidebar.toggleSidebar);
  const isMobile = useIsMobile();

  return (
    <div className="app-layout">
      <div
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ background: "#4ECDC4", padding: "20px" }}
      >
        Sidebar
        {isMobile && (
          <button onClick={toggleSidebar} style={{ marginTop: "20px" }}>
            Close
          </button>
        )}
      </div>
      <div
        className="top-nav"
        style={{ background: "#FF6B6B", padding: "20px", minHeight: "60px", display: "flex", alignItems: "center", gap: "10px" }}
      >
        {isMobile && (
          <button onClick={toggleSidebar}>☰</button>
        )}
        TopNavigation
      </div>
      <main
        className="content"
        style={{ background: "#95E1D3", padding: "20px" }}
      >
        <Outlet />
      </main>
    </div>
  );
};
