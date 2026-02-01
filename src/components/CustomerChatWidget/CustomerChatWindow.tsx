import { Card, Button } from "react-bootstrap";
import type { MessageDto } from "../../types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import "./styles/CustomerChatWindow.scss";
import { MessageList } from "../AdminChat/MessageList";
import { MessageComposer } from "../AdminChat/MessageComposer";
import { messageKey } from "../../hooks/api/useMessages";
import { useSendMessage, useMarkRead } from "../../hooks/mutations/useChatMutations";
import supportTeamAvatar from "../../assets/support_avatar.webp";
export function CustomerChatWindow({
  open,
  onClose,
  conversationId,
  loading,
  messages,
}: {
  open: boolean;
  onClose: () => void;
  conversationId: string | null;
  loading: boolean;
  messages: MessageDto[];
}) {
  const qc = useQueryClient();
  const sendMutation = useSendMessage(conversationId);
  const markReadMutation = useMarkRead(conversationId);

  if (!open) return null;

  return (
    <div className="chat-window">
      <Card className="card" id="customer-chat-window">
        {/* Header */}
        <div className="header">
          <div className="avatar-wrapper">
            <img
              src={supportTeamAvatar}
              alt="Support Team Avatar"
              className="support-avatar"
              width={80}
              height={80}
            />
          </div>
          <div className="header-content">
            <div className="title">Support Chat</div>
            <div className="subtitle">
              Typically replies instantly
            </div>
          </div>
          <Button
            size="sm"
            variant="outline-light"
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="body">
          {loading && (
            <div className="loading">
              <LoadingSpinner />
              Loading…
            </div>
          )}

          <div className="messages">
            <MessageList messages={messages} meSenderType="Customer" />
          </div>

          {/* Composer (customer sends) */}
          <MessageComposer
            meSenderType="Customer"
            onSend={async (text) => {
              if (!conversationId) return;

              const sent = await sendMutation.mutateAsync(text);

              // optimistic add (SignalR will also deliver it; prevent duplicates by id)
              qc.setQueryData(
                [messageKey(conversationId)],
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

              // Customer is viewing now -> mark read (keeps unread count correct server-side)
              await markReadMutation.mutateAsync();
            }}
          />
        </div>
      </Card>
    </div>
  );
}
