import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { markRead } from "../../api/chatApi";
import { startSignalR, joinConversation } from "../../realtime/signalR";
import { useUiStore } from "../../store/uiStore";
import {
  useCustomerConversation,
  customerConversationKey,
} from "../../hooks/useCustomerConversation";
import { useMessages } from "../../hooks/useMessages";
import { CustomerChatExecuter } from "./CustomerChatExecuter";
import { CustomerChatWindow } from "./CustomerChatWindow";
import type { CustomerConversationDto } from "../../types/chat";

export function CustomerChatWidget() {
  const qc = useQueryClient();
  const isOpen = useUiStore((s) => s.customerChatOpen);
  const setOpen = useUiStore((s) => s.customer.setChatOpen);
  const clearUnread = useUiStore((s) => s.unread.clear);
  const setUnread = useUiStore((s) => s.unread.set);

  // Ensure SignalR is running (shared with admin if same app)
  useEffect(() => {
    startSignalR().catch(() => {});
  }, []);

  // Step 1: Open/get conversation id (once)
  const {
    data: convData,
    isLoading: convLoading,
    isError: convError,
  } = useCustomerConversation();

  const conversationId = convData?.conversationId ?? null;

  // Initialize unread count from backend response
  useEffect(() => {
    if (convData?.unreadForCustomerCount !== undefined && !isOpen) {
      setUnread(convData.unreadForCustomerCount);
    }
  }, [convData?.unreadForCustomerCount, setUnread, isOpen]);

  // Join conversation group once we have id
  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId).catch(() => {});
  }, [conversationId]);

  // Load messages only when window is open (saves bandwidth)
  const { data: messages, isLoading: messagesLoading } = useMessages(
    isOpen ? conversationId : null
  );

  // When opened: mark as read + clear badge
  useEffect(() => {
    if (!conversationId || !isOpen) return;

    (async () => {
      try {
        await markRead(conversationId);
        clearUnread();

        // Update React Query cache to reset unread count
        qc.setQueryData<CustomerConversationDto>(
          [customerConversationKey],
          (old) => (old ? { ...old, unreadForCustomerCount: 0 } : old)
        );
      } catch {
        // ignore errors
      }
    })();
  }, [conversationId, isOpen, clearUnread, qc]);

  return (
    <>
      <CustomerChatExecuter
        disabled={convLoading || convError || !conversationId}
        onToggle={() => setOpen(!isOpen)}
      />

      <CustomerChatWindow
        open={isOpen}
        onClose={() => setOpen(false)}
        conversationId={conversationId}
        loading={convLoading || (isOpen && messagesLoading)}
        messages={messages ?? []}
      />
    </>
  );
}
