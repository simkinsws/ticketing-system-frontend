import { useMemo, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useUiStore } from "../../store/uiStore";
import { useAdminInbox } from "../../hooks/state/useAdminInbox";
import { ConversationItem } from "./ConversationItem";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import "./styles/InboxPanel.scss";
import { FormInput } from "../shared/FormInput/FormInput";
import searchIcon from "../../assets/search-icon.svg";
import { Link } from "react-router";
export function InboxPanel() {
  const selectedId = useUiStore((s) => s.selectedConversationId);
  const selectConversation = useUiStore((s) => s.admin.selectConversation);

  const { data, isLoading, isError } = useAdminInbox();
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return data ?? [];

    return (data ?? []).filter((conv) => {
      const name = conv.customerDisplayName?.toLowerCase() ?? "";
      const id = conv.customerUserId?.toLowerCase() ?? "";
      return name.includes(term) || id.includes(term);
    });
  }, [data, filter]);

  return (
    <div className="inbox-panel">
      <div className="header">
        <Link to="/admin/dashboard" className="back-link">
          Back to Admin Dashboard
        </Link>
        <div className="title">Support Chat</div>
        <FormInput
          label=""
          id="inbox-filter"
          type="search"
          placeholder="Filter by name or ID"
          value={filter}
          icon={searchIcon}
          onChange={(e) => setFilter(e.target.value)}
          ariaLabel="Filter conversations"
          className="filter-input"
        />
      </div>

      <div className="content">
        {isLoading && (
          <div className="loading">
            <LoadingSpinner /> Loading support chat…
          </div>
        )}

        {isError && <div className="error">Failed to load inbox.</div>}

        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <div className="empty">No conversations yet</div>
        )}

        {!isLoading && !isError && (
          <ListGroup variant="flush">
            {filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                active={conv.id === selectedId}
                onClick={() => selectConversation(conv.id)}
              />
            ))}
            {!filtered.length && (
              <ListGroup.Item className="text-muted small">
                No matches for “{filter.trim()}”
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
