import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markRead, sendMessage } from "../../api/chat/endpoints";
import { adminInboxKey } from "../state/useAdminInbox";
import { messageKey } from "../api/useMessages";
import type { MessageDto } from "../../types/chat";

export function useSendMessage(conversationId: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!conversationId) throw new Error("No conversationId provided");
      return await sendMessage(conversationId, text);
    },
    onSuccess: (sent) => {
      if (!conversationId) return;
      const key = [messageKey(conversationId)];
      qc.setQueryData(key, (old: MessageDto[] | undefined) => {
        const prev = (old ?? []) as MessageDto[];
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      qc.invalidateQueries({ queryKey: [adminInboxKey], exact: true });
    },
  });
}

export function useMarkRead(conversationId: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!conversationId) throw new Error("No conversationId provided");
      await markRead(conversationId);
    },
    onSuccess: () => {
      if (!conversationId) return;
      qc.setQueryData(adminInboxKey ? [adminInboxKey] : [], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((c: Record<string, unknown>) =>
          (c as Record<string, unknown>).id === conversationId ? { ...c, unreadForAdminCount: 0 } : c
        );
      });
    },
  });
}
