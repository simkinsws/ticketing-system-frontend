export interface NotificationDto {
  id: string;
  title: string;
  subtitle?: string;
  message: string;
  isRead: boolean;
  createdAtUtc: string;
  linkedEntityId?: string;
}

export interface UnreadCountResponse {
  count: number;
}
