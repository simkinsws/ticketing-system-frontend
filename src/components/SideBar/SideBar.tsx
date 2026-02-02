import { useIsMobile } from "../../hooks/ui/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import "./styles/SideBar.scss";
export const SideBar = () => {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.sidebar.toggleSidebar);
  const isMobile = useIsMobile();

  return (
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
  );
};
