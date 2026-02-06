import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import userAvatar from "../../assets/user-avatar-default.png";
import userIcon from "../../assets/user-icon.svg";
import themeIcon from "../../assets/info-icon.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import "./UserMenu.scss";
import lightThemeArrowDown from "../../assets/light-theme-arrow-down.svg";
import darkThemeArrowDown from "../../assets/dark-theme-arrow-down.svg";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = useAuthStore((s) => s.displayName) ?? "User";
  const email = useAuthStore((s) => s.email) ?? "";
  const roles = useAuthStore((s) => s.roles);
  const logout = useAuthStore((s) => s.logout);
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleTheme = useUiStore((s) => s.theme.toggleTheme);

  const roleLabel = useMemo(() => {
    if (!roles || roles.length === 0) return "";
    return roles.join(", ");
  }, [roles]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open user menu"
      >
        <img
          className="user-avatar"
          src={userAvatar}
          alt="User Avatar"
          width={40}
          height={40}
        />
        <div className="user-details">
          <div className="user-name">{displayName}</div>
          <div className="user-email">{email}</div>
        </div>
        <img
          className="user-caret"
          src={themeMode === "dark" ? darkThemeArrowDown : lightThemeArrowDown}
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
        />
      </button>

      {open && (
        <div className="user-menu-panel">
          <div className="user-menu-header">
            <img
              className="user-avatar-lg"
              src={userAvatar}
              alt="User Avatar"
              width={56}
              height={56}
            />
            <div className="user-meta">
              <div className="user-meta-name">{displayName}</div>
              <div className="user-meta-email">{email}</div>
              {roleLabel && <div className="user-meta-role">{roleLabel}</div>}
            </div>
          </div>

          <div className="user-menu-actions">
            <Link
              to="/customer/profile"
              className="menu-item"
              onClick={() => setOpen(false)}
            >
              <span className="menu-item-left">
                <img className="menu-icon" src={userIcon} alt="Profile" />
                <span>My Profile</span>
              </span>
            </Link>

            <div className="menu-item theme-item">
              <span className="menu-item-left">
                <img className="menu-icon" src={themeIcon} alt="Theme" />
                <span>Theme Mode</span>
              </span>
              <div className="theme-toggle-group">
                <span className="theme-label">
                  {themeMode === "dark" ? "Dark" : "Light"}
                </span>
                <label className="theme-toggle">
                  <input
                    type="checkbox"
                    checked={themeMode === "dark"}
                    onChange={toggleTheme}
                    aria-label="Toggle dark mode"
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>

            <button className="menu-item danger" onClick={logout}>
              <span className="menu-item-left">
                <img className="menu-icon" src={logoutIcon} alt="Logout" />
                <span>Logout</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
