import { useIsMobile } from "../../hooks/ui/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import { NotificationBadge } from "../NotificationBadge/NotificationBadge";
import { UserMenu } from "../UserMenu/UserMenu";
import "./styles/TopToolBar.scss";
import hamburgerMenu from "../../assets/hamburger.svg";
import darkHamburgerMenu from "../../assets/dark-theme-hamburger.svg";
export const TopToolBar = () => {
  const toggleSidebar = useUiStore((s) => s.sidebar.toggleSidebar);
  const themeMode = useUiStore((s) => s.themeMode);
  const isMobile = useIsMobile();
  return (
    <div className="top-nav">
      {isMobile && (
        <img src={themeMode === "dark" ? darkHamburgerMenu : hamburgerMenu} alt="Menu" onClick={toggleSidebar} />
      )}
      <div className="actions">
        <NotificationBadge />
        <UserMenu />
      </div>
    </div>
  );
};
