import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button } from "react-bootstrap";
import { useUiStore } from "../../store/uiStore";
import { joinConversation, leaveConversation } from "../../realtime/signalR";
import { useMessages, messageKey } from "../../hooks/useMessages";
import { useSendMessage, useMarkRead } from "../../hooks/useChatMutations";
import { adminInboxKey } from "../../hooks/useAdminInbox";
import type { ConversationListItemDto, MessageDto } from "../../types/chat";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import "./styles/ChatPanel.scss";

export function ChatPanel({ isMobile = false }: { isMobile?: boolean }) {
  const qc = useQueryClient();
  const selectedId = useUiStore((s) => s.selectedConversationId);
  const clearSelection = useUiStore((s) => s.admin.clearSelection);
  const selectedConv = useMemo(() => {
    const inbox =
      qc.getQueryData<ConversationListItemDto[]>([adminInboxKey]) ?? [];
    return inbox.find((c) => c.id === selectedId) ?? null;
  }, [selectedId, qc]);

  const { data: messages, isLoading } = useMessages(selectedId);

  const sendMutation = useSendMessage(selectedId);
  const markReadMutation = useMarkRead(selectedId);

  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevIdRef.current;
    const next = selectedId;

    (async () => {
      if (prev) {
        try {
          await leaveConversation(prev);
        } catch {
          //Ignored
        }
      }
      if (next) {
        try {
          await joinConversation(next);
        } catch {
          //Ignored
        }
      }
      prevIdRef.current = next;
    })();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    (async () => {
      try {
        await markReadMutation.mutateAsync();
        qc.setQueryData<ConversationListItemDto[]>([adminInboxKey], (old) =>
          (old ?? []).map((c) =>
            c.id === selectedId ? { ...c, unreadForAdminCount: 0 } : c
          )
        );
      } catch {
        // Ignored
      }
    })();
  }, [selectedId, qc]);

  if (!selectedId || !selectedConv) {
    return (
      <div className="chat-panel no-selection">
        <div className="message">👈 Select a conversation to start</div>
      </div>
    );
  }

  return (
    <div className="chat-panel" id="chat-panel">
      <Card className="header rounded-0 border-0 border-bottom">
        <Card.Body className="body">
          {isMobile && (
            <Button
              variant="link"
              className="back-btn"
              onClick={clearSelection}
            >
              ← Back
            </Button>
          )}
          <div className="name">{selectedConv.customerDisplayName}</div>
          <div className="id">Customer ID: {selectedConv.customerUserId}</div>
        </Card.Body>
      </Card>

      {isLoading && (
        <div className="loading">
          <LoadingSpinner /> Loading messages…
        </div>
      )}

      <MessageList messages={messages ?? []} meSenderType="Admin" />

      <MessageComposer
        meSenderType="Admin"
        onSend={async (text) => {
          const sent = await sendMutation.mutateAsync(text);

          qc.setQueryData(
            [messageKey(selectedId)],
            (old: MessageDto[] | undefined) => {
              const prev = (old ?? []) as MessageDto[];
              if (prev.some((m) => m.id === sent.id)) return prev;
              return [...prev, sent].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
            }
          );

          await markReadMutation.mutateAsync();
        }}
      />
    </div>
  );
}
