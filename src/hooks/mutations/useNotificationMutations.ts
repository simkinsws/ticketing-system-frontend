import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/notifications/endpoints";
import {
  notificationsQueryKey,
  unreadCountQueryKey,
} from "../api/useNotificationsApi";
import type { NotificationDto } from "../../types/notifications";

export const useMarkNotificationAsReadMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      qc.setQueryData(
        [notificationsQueryKey],
        (old: NotificationDto[] | undefined) => {
          if (!old) return old;
          return old.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          );
        },
      );

      qc.setQueryData([unreadCountQueryKey], (old: number | undefined) => {
        if (old === undefined) return old;
        return Math.max(0, old - 1);
      });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      qc.setQueryData(
        [notificationsQueryKey],
        (old: NotificationDto[] | undefined) => {
          if (!old) return old;
          return old.map((n) => ({ ...n, isRead: true }));
        },
      );

      qc.setQueryData([unreadCountQueryKey], 0);
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationId) => {
      qc.setQueryData(
        [notificationsQueryKey],
        (old: NotificationDto[] | undefined) => {
          if (!old) return old;
          const target = old.find((n) => n.id === notificationId);
          const next = old.filter((n) => n.id !== notificationId);

          if (target && !target.isRead) {
            qc.setQueryData(
              [unreadCountQueryKey],
              (count: number | undefined) => {
                if (count === undefined) return count;
                return Math.max(0, count - 1);
              },
            );
          }

          return next;
        },
      );
    },
  });
};
