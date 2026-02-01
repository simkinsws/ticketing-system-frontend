import * as signalR from "@microsoft/signalr";
import type { ConversationListItemDto, MessageDto } from "../types/chat";
import { queryClient } from "../app/queryClient";
import { useUiStore } from "../store/uiStore";
import { adminInboxKey } from "../hooks/useAdminInbox";
import { messageKey } from "../hooks/useMessages";
import { customerConversationKey } from "../hooks/useCustomerConversation";

const INBOX_KEY = [adminInboxKey] as const;
const MSG_KEY = (conversationId: string) => [messageKey(conversationId)] as const;

let connection: signalR.HubConnection | null = null;
const joinedConversations = new Set<string>();

// Dedupes concurrent start calls
let starting: Promise<signalR.HubConnection> | null = null;

// Ensure we register handlers only once per connection instance
let handlersRegistered = false;

const hubBase = import.meta.env.VITE_SIGNALR_URL?.trim() || "";
const hubUrl = hubBase ? `${hubBase}/hubs/support` : "/hubs/support";

function ensureConnection(): signalR.HubConnection {
  if (connection) return connection;

  const token = localStorage.getItem("auth-token");

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token || "",
      skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .build();

  handlersRegistered = false;
  return connection;
}

function registerHandlersOnce(conn: signalR.HubConnection) {
  if (handlersRegistered) return;

  const ui = useUiStore.getState();

  // Connection lifecycle
  conn.onreconnecting(() => ui.connection.setReconnecting());
  conn.onreconnected(async () => {
    ui.connection.setConnected();

    // SignalR drops group membership on reconnect; rejoin tracked conversations
    try {
      const current = Array.from(joinedConversations);
      if (!current.length) return;

      if (conn.state !== signalR.HubConnectionState.Connected) return;

      await Promise.all(
        current.map((id) => conn.invoke("JoinConversation", id))
      );
    } catch (err) {
      console.error("Failed to rejoin conversations after reconnect", err);
    }
  });
  conn.onclose(() => ui.connection.setDisconnected());

  conn.on("MessageCreated", (msg: MessageDto) => {
    // Always keep message cache updated
    const key = MSG_KEY(msg.conversationId);
    const wasAlreadyPresent = (queryClient.getQueryData<MessageDto[]>(key) ?? [])
      .some((m) => m.id === msg.id);

    queryClient.setQueryData<MessageDto[]>(key, (old) => {
      const prev = old ?? [];
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    // Customer widget unread logic
    const uiNow = useUiStore.getState();
    const customerConvId = queryClient.getQueryData<{ conversationId: string }>(
      [customerConversationKey]
    )?.conversationId;

    const senderIsAdmin = msg.senderType === "Admin" || msg.senderType === 1;

    if (
      customerConvId &&
      msg.conversationId === customerConvId &&
      senderIsAdmin
    ) {
      // Some servers replay messages on reconnect; only increment if new
      if (!uiNow.customerChatOpen && !wasAlreadyPresent) uiNow.unread.increment();
    }
  });

  conn.on("ConversationUpserted", (conv: ConversationListItemDto) => {
    queryClient.setQueryData<ConversationListItemDto[]>(INBOX_KEY, (old) => {
      const prev = old ?? [];
      const idx = prev.findIndex((c) => c.id === conv.id);

      // Merge with existing to avoid dropping fields (some events omit preview/sender)
      const merged = (existing: ConversationListItemDto | undefined) => {
        if (!existing) return conv;

        const previewFromIncoming =
          conv.lastMessagePreview !== undefined && conv.lastMessagePreview !== null
            ? conv.lastMessagePreview
            : undefined;

        const senderFromIncoming =
          conv.lastMessageSender !== undefined && conv.lastMessageSender !== null
            ? conv.lastMessageSender
            : undefined;

        return {
          ...existing,
          ...conv,
          // Only override preview when the incoming value is non-empty
          lastMessagePreview:
            previewFromIncoming !== undefined && previewFromIncoming !== ""
              ? previewFromIncoming
              : existing.lastMessagePreview ?? null,
          // Only override sender when present (0/1 are valid values)
          lastMessageSender:
            senderFromIncoming !== undefined
              ? senderFromIncoming
              : existing.lastMessageSender ?? null,
        };
      };

      const hasExisting = idx >= 0;
      const hasPreview =
        conv.lastMessagePreview !== undefined &&
        conv.lastMessagePreview !== null &&
        conv.lastMessagePreview !== "";
      const hasSender = conv.lastMessageSender !== undefined && conv.lastMessageSender !== null;

      // If the server emits a partial update before the initial fetch, ignore it so we don't lose preview/sender
      if (!hasExisting && !hasPreview && !hasSender) {
        return prev;
      }

      const next =
        idx >= 0
          ? [...prev.slice(0, idx), merged(prev[idx]), ...prev.slice(idx + 1)]
          : [conv, ...prev];

      next.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
      );

      return next;
    });

    const selected = useUiStore.getState().selectedConversationId;
    if (selected === conv.id) {
      queryClient.setQueryData<ConversationListItemDto[]>(INBOX_KEY, (old) =>
        (old ?? []).map((c) =>
          c.id === conv.id ? { ...c, unreadForAdminCount: 0 } : c
        )
      );
    }
  });

  handlersRegistered = true;
}

export async function startSignalR(): Promise<signalR.HubConnection> {
  // If already connected, return immediately
  if (connection?.state === signalR.HubConnectionState.Connected)
    return connection;

  // Deduplicate concurrent calls
  if (starting) return starting;

  const ui = useUiStore.getState();
  ui.connection.setLoading();

  const conn = ensureConnection();
  registerHandlersOnce(conn);

  starting = (async () => {
    try {
      // Only start if currently disconnected
      if (conn.state === signalR.HubConnectionState.Disconnected) {
        await conn.start();
      }
      ui.connection.setConnected();
      return conn;
    } catch (err) {
      console.error("SignalR start failed:", err);
      ui.connection.setDisconnected();

      // allow future retries
      try {
        conn.stop().catch(() => {});
      } catch {
        // ignored
      }
      connection = null;
      handlersRegistered = false;

      throw err;
    } finally {
      starting = null;
    }
  })();

  return starting;
}

export function getSignalRConnection(): signalR.HubConnection | null {
  return connection;
}

async function requireConnected(): Promise<signalR.HubConnection> {
  const conn = await startSignalR();
  if (conn.state !== signalR.HubConnectionState.Connected) {
    throw new Error(`SignalR is not connected (state=${conn.state}).`);
  }
  return conn;
}

export async function joinConversation(conversationId: string) {
  const conn = await requireConnected();
  await conn.invoke("JoinConversation", conversationId);
  joinedConversations.add(conversationId);
}

export async function leaveConversation(conversationId: string) {
  const conn = await requireConnected();
  await conn.invoke("LeaveConversation", conversationId);
  joinedConversations.delete(conversationId);
}

export async function stopSignalR() {
  if (!connection) return;
  try {
    await connection.stop();
  } finally {
    useUiStore.getState().connection.setDisconnected();
    connection = null;
    handlersRegistered = false;
    starting = null;
  }
}
