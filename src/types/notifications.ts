/**
 * Notification types and interfaces
 */

export type NotificationType = "message" | "ticket" | "system" | "alert";

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
  isRead: boolean;
  createdAtUtc: string;
  linkedEntityId?: string; // Could be ticket ID, conversation ID, etc.
}

export interface UnreadCountResponse {
  count: number;
}
