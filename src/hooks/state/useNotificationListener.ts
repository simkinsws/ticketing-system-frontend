import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getNotificationConnection, startNotificationSignalR } from "../../realtime/signalR";
import { notificationsQueryKey, unreadCountQueryKey } from "../api/useNotificationsApi";
import type { NotificationDto } from "../../types/notifications";

export function useNotificationListener() {
  const qc = useQueryClient();

  const handleNewNotification = useCallback(
    (notification: NotificationDto) => {
      // Add to notifications list
      qc.setQueryData([notificationsQueryKey], (old: NotificationDto[] | undefined) => {
        if (!old) return [notification];
        // Check if notification already exists
        if (old.some((n) => n.id === notification.id)) return old;
        return [notification, ...old];
      });

      // Increment unread count (new notifications are always unread)
      qc.setQueryData([unreadCountQueryKey], (old: number | undefined) => {
        return (old ?? 0) + 1;
      });
    },
    [qc]
  );

  useEffect(() => {
    let isMounted = true;

    const setupNotificationListener = async () => {
      try {
        const conn = await startNotificationSignalR();
        
        if (!isMounted) return;
        conn.on("notificationCreated", handleNewNotification);
      } catch (err) {
        if (isMounted) {
          console.error("Failed to connect to notification hub:", err);
        }
      }
    };

    setupNotificationListener();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      const conn = getNotificationConnection();
      if (conn) {
        conn.off("notificationCreated", handleNewNotification);
      }
    };
  }, [handleNewNotification]);
}
