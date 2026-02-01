import { useState, useRef } from "react";
import "./styles/MessageComposer.scss";
import sendIcon from "../../assets/chat-send-button.svg";
import sendAdminIcon from "../../assets/admin-send.svg";
import Form from "react-bootstrap/Form";
export function MessageComposer({
  onSend,
  meSenderType,
}: {
  onSend: (text: string) => Promise<void>;
  meSenderType: "Admin" | "Customer";
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const customerInputRef = useRef<HTMLDivElement>(null);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    setText("");
    if (customerInputRef.current) {
      customerInputRef.current.textContent = "";
    }
    try {
      await onSend(trimmed);
    } catch {
      setText(trimmed);
      if (customerInputRef.current) {
        customerInputRef.current.textContent = trimmed;
      }
      console.error("Failed to send message");
    } finally {
      setBusy(false);
    }
  }

  const isCustomer = meSenderType.toLowerCase() === "customer";

  if (isCustomer) {
    return (
      <div
        className={`message-composer ${meSenderType.toLowerCase()}`}
        style={{ position: "relative" }}
      >
        <div
          ref={customerInputRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setText(e.currentTarget.textContent || "")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          className="input"
          aria-label="Message input"
        />
        <img
          src={sendIcon}
          alt="Send"
          onClick={send}
          className="send-button"
          style={{
            cursor: busy || !text.trim() ? "not-allowed" : "pointer",
            opacity: busy || !text.trim() ? 0.5 : 1,
          }}
        />
      </div>
    );
  }

  return (
    <div className={`message-composer ${meSenderType.toLowerCase()}`}>
      <Form.Control
        as="textarea"
        rows={2}
        placeholder="Type your reply…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        className="input"
      />
      <img
        src={sendAdminIcon}
        alt="Send"
        onClick={send}
        className="send-button"
        style={{
          cursor: busy || !text.trim() ? "not-allowed" : "pointer",
          opacity: busy || !text.trim() ? 0.5 : 1,
        }}
      />
    </div>
  );
}
