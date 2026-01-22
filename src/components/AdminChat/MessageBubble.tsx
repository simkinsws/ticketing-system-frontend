import type { MessageDto } from "../../types/chat";
import { formatTime } from "../../utils/time";
import "./styles/MessageBubble.scss";

function normalizeSenderType(t: string | number): "Admin" | "Customer" {
  if (t === "Admin" || t === 1) return "Admin";
  return "Customer";
}

export function MessageBubble({
  msg,
  meSenderType,
}: {
  msg: MessageDto;
  meSenderType: "Admin" | "Customer";
}) {
  const sender = normalizeSenderType(msg.senderType);
  const isMe = sender === meSenderType;

  return (
    <div className={`message-bubble ${isMe ? 'me' : 'other'}`}>
      <div className={`bubble ${isMe ? 'me' : ''}`}>
        <div className="text">{msg.text}</div>
        <div className="timestamp">{formatTime(msg.createdAt)}</div>
      </div>
    </div>
  );
}
