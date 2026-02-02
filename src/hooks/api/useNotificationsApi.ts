import { useQuery } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadCount,
} from "../../api/notifications/endpoints";

export const notificationsQueryKey = "notifications";
export const unreadCountQueryKey = "unread-count";

export const useNotificationsApi = () => {
  return useQuery({
    queryKey: [notificationsQueryKey],
    queryFn: fetchNotifications,
    staleTime: Infinity,
    refetchOnWindowFocus: true,
  });
};

export const useUnreadCountApi = () => {
  return useQuery({
    queryKey: [unreadCountQueryKey],
    queryFn: fetchUnreadCount,
    staleTime: Infinity,
    refetchOnWindowFocus: true, 
  });
};
