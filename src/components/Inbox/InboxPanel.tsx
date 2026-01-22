import { ListGroup } from "react-bootstrap";
import { useUiStore } from "../../store/uiStore";
import { useAdminInbox } from "../../hooks/useAdminInbox";
import { ConversationItem } from "./ConversationItem";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import "./styles/InboxPanel.scss";

export function InboxPanel() {
  const selectedId = useUiStore((s) => s.selectedConversationId);
  const selectConversation = useUiStore((s) => s.admin.selectConversation);

  const { data, isLoading, isError } = useAdminInbox();

  return (
    <div className="inbox-panel">
      <div className="header">
        <div className="title">Conversations</div>
      </div>

      <div className="content">
        {isLoading && (
          <div className="loading">
            <LoadingSpinner /> Loading conversations…
          </div>
        )}

        {isError && <div className="error">Failed to load inbox.</div>}

        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <div className="empty">No conversations yet</div>
        )}

        {!isLoading && !isError && (
          <ListGroup variant="flush">
            {(data ?? []).map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                active={conv.id === selectedId}
                onClick={() => selectConversation(conv.id)}
              />
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
