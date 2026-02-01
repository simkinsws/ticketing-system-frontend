import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../../api/chat/endpoints";

const messageKey = (conversationId: string) =>
  `/api/chat/conversations/${conversationId}/messages`;

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: [conversationId ? messageKey(conversationId) : ""],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
  });
}

export { messageKey };
