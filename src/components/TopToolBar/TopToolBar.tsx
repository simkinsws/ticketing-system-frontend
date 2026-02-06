import { useIsMobile } from "../../hooks/ui/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import { NotificationBadge } from "../NotificationBadge/NotificationBadge";
import { UserMenu } from "../UserMenu/UserMenu";
import "./styles/TopToolBar.scss";
import hamburgerMenu from "../../assets/hamburger.svg";

export const TopToolBar = () => {
  const toggleSidebar = useUiStore((s) => s.sidebar.toggleSidebar);
  const isMobile = useIsMobile();
  return (
    <div className="top-nav">
      {isMobile && (
        <img src={hamburgerMenu} alt="Menu" onClick={toggleSidebar} />
      )}
      <div className="actions">
        <NotificationBadge />
        <UserMenu />
      </div>
    </div>
  );
};
