export type SenderType = "Customer" | "Admin" | 0 | 1;

export type ConversationListItemDto = {
  id: string;
  customerUserId: string;
  customerDisplayName: string;
  lastMessageAt: string; // ISO
  lastMessagePreview?: string | null;
  lastMessageSender?: SenderType | null;
  unreadForAdminCount: number;
  unreadForCustomerCount: number;
};

export type MessageDto = {
  id: string;
  conversationId: string;
  senderType: SenderType;
  senderUserId: string;
  text: string;
  createdAt: string; // ISO
};

export type CustomerConversationDto = {
  conversationId: string;
  unreadForCustomerCount: number;
  lastCustomerReadAt?: string;
};
