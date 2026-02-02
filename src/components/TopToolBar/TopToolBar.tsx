import { useIsMobile } from "../../hooks/ui/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { NotificationBadge } from "../NotificationBadge/NotificationBadge";
import "./styles/TopToolBar.scss";
import hamburgerMenu from "../../assets/hamburger.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import userAvatar from "../../assets/user-avatar-default.png";

export const TopToolBar = () => {
  const toggleSidebar = useUiStore((s) => s.sidebar.toggleSidebar);
  const logout = useAuthStore((s) => s.logout);
  const isMobile = useIsMobile();
  const displayName = useAuthStore((s) => s.displayName);
  const userRole = useAuthStore((s) => s.roles[0]);
  return (
    <div className="top-nav">
      {isMobile && (
        <img src={hamburgerMenu} alt="Menu" onClick={toggleSidebar} />
      )}
      <div className="actions">
        <div className="user-info">
          <img src={userAvatar} alt="User Avatar" width={50} height={50} />
          <div className="user-details">
            <div>{displayName}</div>
            <div>{userRole}</div>
          </div>
        </div>
        <NotificationBadge />
        <img
          src={logoutIcon}
          alt="Logout"
          width={22}
          height={22}
          onClick={logout}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};
