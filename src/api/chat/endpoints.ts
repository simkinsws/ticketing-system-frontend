import { http } from "../core/http";
import type { ConversationListItemDto, MessageDto, CustomerConversationDto } from "../../types/chat";

export async function fetchAdminInbox(): Promise<ConversationListItemDto[]> {
  const res = await http.get("/api/admin/inbox");
  return res.data;
}

export async function fetchMessages(conversationId: string): Promise<MessageDto[]> {
  const res = await http.get(`/api/chat/conversations/${conversationId}/messages`);
  return res.data;
}

export async function sendMessage(conversationId: string, text: string): Promise<MessageDto> {
  const res = await http.post(`/api/chat/messages/send`, { conversationId, text });
  return res.data;
}

export async function markRead(conversationId: string): Promise<void> {
  await http.post(`/api/chat/conversations/${conversationId}/read`);
}

export async function openCustomerConversation(): Promise<CustomerConversationDto> {
  const res = await http.post("/api/support/conversation/open");
  return res.data;
}
