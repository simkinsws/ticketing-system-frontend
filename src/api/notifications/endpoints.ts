import type { NotificationDto, UnreadCountResponse } from "../../types/notifications";
import { http } from "../core/http";

export type { NotificationDto, UnreadCountResponse };

export async function fetchNotifications(): Promise<NotificationDto[]> {
  const res = await http.get("/api/notifications");
  return res.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await http.get("/api/notifications/unread-count");
  return res.data.count;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await http.post(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await http.post("/api/notifications/read-all");
}

export async function deleteNotification(id: string): Promise<void> {
  await http.delete(`/api/notifications/${id}`);
}
