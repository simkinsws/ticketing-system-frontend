import { useState, useEffect, useRef } from "react";
import { useNotificationsApi, useUnreadCountApi } from "../../hooks/api/useNotificationsApi";
import {
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../hooks/mutations/useNotificationMutations";
import { useNotificationListener } from "../../hooks/state/useNotificationListener";
import { formatDistanceToNow } from "../../utils/dateGrouping";
import notificationBell from "../../assets/notification-bell.svg";
import "./NotificationBadge.scss";

export const NotificationBadge = () => {
  const [showPanel, setShowPanel] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotificationsApi();
  const { data: unreadCount = 0 } = useUnreadCountApi();

  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  useNotificationListener();

  // Handle click outside to close panel
  useEffect(() => {
    if (!showPanel) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <div className="notification-badge" ref={badgeRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setShowPanel(!showPanel)}
        aria-label="Toggle notifications"
      >
        <img
          src={notificationBell}
          alt="Notifications"
          width={22}
          height={22}
        />
        {unreadCount > 0 && (
          <span className="badge">
            {unreadCount > 10 ? "10+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="timestamp">
                      {formatDistanceToNow(new Date(notification.createdAtUtc))}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <button
                      className="mark-read-btn"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsReadMutation.isPending}
                      aria-label="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
