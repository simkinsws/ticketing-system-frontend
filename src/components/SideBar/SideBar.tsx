import { NavLink } from "react-router";
import { useIsMobile } from "../../hooks/ui/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import "./styles/SideBar.scss";
import lightSidebarLogo from "../../assets/light-theme-sidebar-logo.svg";
import lightDashboardIcon from "../../assets/light-theme-dashboard-icon.svg";
import darkDashboardIcon from "../../assets/dark-theme-dashborad-icon.svg";
import lightTicketsIcon from "../../assets/light-theme-tickets-icon.svg";
import darkTicketsIcon from "../../assets/dark-theme-tickets-icon.svg";
import lightProfileIcon from "../../assets/light-theme-profile-icon.svg";
import darkProfileIcon from "../../assets/dark-theme-profile-icon.svg";
import closeSidebarIcon from "../../assets/dark-theme-close-sidebar.svg";

export const SideBar = () => {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.sidebar.toggleSidebar);
  const isMobile = useIsMobile();
  const themeMode = useUiStore((s) => s.themeMode);

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img
          src={lightSidebarLogo}
          alt="TicketHub Logo"
          className="sidebar-logo"
        />
        <div className="sidebar-text">
          <span className="sidebar-title">TicketHub</span>
          <span className="sidebar-subtitle">Support System</span>
        </div>
        {isMobile && (
          <img src={closeSidebarIcon} alt="Close" onClick={toggleSidebar} className="close-sidebar" />
        )}
      </div>
      <section className="sidebar-links">
        <NavLink
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
          to="/customer/dashboard"
        >
          <img
            className="sidebar-link-icon"
            src={themeMode === "dark" ? darkDashboardIcon : lightDashboardIcon}
            alt=""
            aria-hidden="true"
          />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
          to="/customer/tickets"
        >
          <img
            className="sidebar-link-icon"
            src={themeMode === "dark" ? darkTicketsIcon : lightTicketsIcon}
            alt=""
            aria-hidden="true"
          />
          <span>My Tickets</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
          to="/customer/profile"
        >
          <img
            className="sidebar-link-icon"
            src={themeMode === "dark" ? darkProfileIcon : lightProfileIcon}
            alt=""
            aria-hidden="true"
          />
          <span>My Profile</span>
        </NavLink>
      </section>
    </div>
  );
};
