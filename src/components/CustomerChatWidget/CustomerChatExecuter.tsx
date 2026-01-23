import { Button, Badge } from "react-bootstrap";
import { useUiStore } from "../../store/uiStore";
import "./styles/CustomerChatExecuter.scss";
import chatIcon from "../../assets/chat-icon.svg";

export function CustomerChatExecuter({
  onToggle,
  disabled,
}: {
  onToggle: () => void;
  disabled?: boolean;
}) {
  const isOpen = useUiStore((s) => s.customerChatOpen);
  const unread = useUiStore((s) => s.customerUnreadCount);

  const showBadge = !isOpen && unread > 0;

  return (
    <div className="chat-executer">
      <Button
        onClick={onToggle}
        disabled={disabled}
        className="button-chat"
        aria-label="Open support chat"
      >
        <img src={chatIcon} alt="Chat Icon" />
        {showBadge && (
          <Badge bg="danger" pill className="badge">
            {unread}
          </Badge>
        )}
      </Button>
    </div>
  );
}
