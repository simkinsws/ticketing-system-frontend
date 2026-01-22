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

// Dedupes concurrent start calls
let starting: Promise<signalR.HubConnection> | null = null;

// Ensure we register handlers only once per connection instance
let handlersRegistered = false;

function ensureConnection(): signalR.HubConnection {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/support", { withCredentials: true }) // proxy this in Vite OR use absolute backend URL
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
  conn.onreconnected(() => ui.connection.setConnected());
  conn.onclose(() => ui.connection.setDisconnected());

  // Domain events
  conn.on("MessageCreated", (msg: MessageDto) => {
    // Always keep message cache updated
    queryClient.setQueryData<MessageDto[]>(
      MSG_KEY(msg.conversationId),
      (old) => {
        const prev = old ?? [];
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    );

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
      if (!uiNow.customerChatOpen) uiNow.unread.increment();
    }
  });

  conn.on("ConversationUpserted", (conv: ConversationListItemDto) => {
    queryClient.setQueryData<ConversationListItemDto[]>(INBOX_KEY, (old) => {
      const prev = old ?? [];
      const idx = prev.findIndex((c) => c.id === conv.id);

      const next =
        idx >= 0
          ? [...prev.slice(0, idx), conv, ...prev.slice(idx + 1)]
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
}

export async function leaveConversation(conversationId: string) {
  const conn = await requireConnected();
  await conn.invoke("LeaveConversation", conversationId);
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
