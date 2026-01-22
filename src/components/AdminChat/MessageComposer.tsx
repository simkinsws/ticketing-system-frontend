import { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import "./styles/MessageComposer.scss";
import sendIcon from "../../assets/chat-send-button.svg";

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
    // Clear contenteditable div for customer
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
      alert("Failed to send. Please try again.");
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
      <Button
        className="send-btn"
        disabled={busy || !text.trim()}
        onClick={send}
      >
        Send
      </Button>
    </div>
  );
}
