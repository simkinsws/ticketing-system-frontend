import { ListGroup, Badge } from "react-bootstrap";
import type { ConversationListItemDto } from "../../types/chat";
import { formatTime } from "../../utils/time";
import "./styles/ConversationItem.scss";

export function ConversationItem({
  conv,
  active,
  onClick,
}: {
  conv: ConversationListItemDto;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <ListGroup.Item
      action
      active={active}
      onClick={onClick}
      className={`conversation-item ${active ? "active" : ""}`}
    >
      <div className="item-content">
        <div className="details">
          <div className="name">
            {conv.customerDisplayName}{" "}
            {conv.unreadForAdminCount > 0 && (
              <Badge bg="success" pill className="badge">
                {conv.unreadForAdminCount}
              </Badge>
            )}
          </div>
          <div className="preview">{conv.lastMessagePreview ?? ""}</div>
        </div>

        <div className="timestamp">{formatTime(conv.lastMessageAt)}</div>
      </div>
    </ListGroup.Item>
  );
}
