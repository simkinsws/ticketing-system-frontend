import { useEffect, useRef, useMemo } from "react";
import type { MessageDto } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";
import { getDateLabel, getDateKey } from "../../utils/dateGrouping";
import "./styles/MessageList.scss";

export function MessageList({
  messages,
  meSenderType,
}: {
  messages: MessageDto[];
  meSenderType: "Admin" | "Customer";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { dateKey: string; dateLabel: string; messages: MessageDto[] }[] = [];
    
    for (const msg of messages) {
      const dateKey = getDateKey(msg.createdAt);
      const dateLabel = getDateLabel(msg.createdAt);
      
      const existingGroup = groups.find((g) => g.dateKey === dateKey);
      if (existingGroup) {
        existingGroup.messages.push(msg);
      } else {
        groups.push({ dateKey, dateLabel, messages: [msg] });
      }
    }
    
    return groups;
  }, [messages]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div ref={ref} className={`message-list ${meSenderType.toLowerCase()}`}>
      {groupedMessages.map((group) => (
        <div key={group.dateKey}>
          <div className="date-separator">
            <span>{group.dateLabel}</span>
          </div>
          {group.messages.map((m) => (
            <MessageBubble key={m.id} msg={m} meSenderType={meSenderType} />
          ))}
        </div>
      ))}
    </div>
  );
}
