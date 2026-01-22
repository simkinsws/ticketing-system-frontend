import { Badge } from "react-bootstrap";
import "../styles/ConnectionStatus.scss";
import { useUiStore } from "../../store/uiStore";

export const ConnectionStatus = () => {
  const status = useUiStore((s) => s.connectionStatus);

  const { text, variant } =
    status === "connected"
      ? { text: "✓ Connected", variant: "success" as const }
      : status === "reconnecting" || status === "loading"
      ? {
          text: status === "loading" ? "Loading…" : "Reconnecting…",
          variant: "warning" as const,
        }
      : { text: "✗ Disconnected", variant: "danger" as const };

  return (
    <Badge bg={variant} className="connection-status">
      {text}
    </Badge>
  );
};
