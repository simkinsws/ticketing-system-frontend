import { create } from "zustand";

export type ConnStatus =
  | "loading"
  | "connected"
  | "disconnected"
  | "reconnecting";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "theme-mode";

const applyTheme = (mode: ThemeMode) => {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.setAttribute("dark-theme", mode);
  localStorage.setItem(THEME_KEY, mode);
};

type UiState = {
  // Admin UI
  selectedConversationId: string | null;
  admin: {
    selectConversation: (id: string) => void;
    clearSelection: () => void;
  };

  // Connection
  connectionStatus: ConnStatus;
  connection: {
    setLoading: () => void;
    setConnected: () => void;
    setReconnecting: () => void;
    setDisconnected: () => void;
    setStatus: (s: ConnStatus) => void;
  };

  // Customer Widget UI
  customerChatOpen: boolean;
  customer: {
    toggleChat: () => void;
    setChatOpen: (open: boolean) => void;
  };

  // Unread badge (customer side)
  customerUnreadCount: number;
  unread: {
    increment: () => void;
    clear: () => void;
    set: (n: number) => void;
  };

  // Sidebar Mobile
  sidebarOpen: boolean;
  sidebar: {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
  };

  // Theme
  themeMode: ThemeMode;
  theme: {
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    initTheme: () => void;
  };
};

export const useUiStore = create<UiState>((set) => ({
  // Admin UI
  selectedConversationId: null,
  admin: {
    selectConversation: (id) => set({ selectedConversationId: id }),
    clearSelection: () => set({ selectedConversationId: null }),
  },

  // Connection
  connectionStatus: "disconnected", // ✅ default should not be "loading"
  connection: {
    setLoading: () => set({ connectionStatus: "loading" }),
    setConnected: () => set({ connectionStatus: "connected" }),
    setReconnecting: () => set({ connectionStatus: "reconnecting" }),
    setDisconnected: () => set({ connectionStatus: "disconnected" }),
    setStatus: (s) => set({ connectionStatus: s }),
  },

  // Customer widget
  customerChatOpen: false,
  customer: {
    toggleChat: () => set((s) => ({ customerChatOpen: !s.customerChatOpen })),
    setChatOpen: (open) => set({ customerChatOpen: open }),
  },

  // Customer unread
  customerUnreadCount: 0,
  unread: {
    increment: () =>
      set((s) => ({ customerUnreadCount: s.customerUnreadCount + 1 })),
    clear: () => set({ customerUnreadCount: 0 }),
    set: (n) => set({ customerUnreadCount: Math.max(0, n) }),
  },

  // Sidebar Mobile
  sidebarOpen: false,
  sidebar: {
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
  },

  // Theme
  themeMode: "light",
  theme: {
    setTheme: (mode) => {
      applyTheme(mode);
      set({ themeMode: mode });
    },
    toggleTheme: () =>
      set((s) => {
        const next: ThemeMode = s.themeMode === "dark" ? "light" : "dark";
        applyTheme(next);
        return { themeMode: next };
      }),
    initTheme: () => {
      if (typeof window === "undefined") return;
      const saved = (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? "light";
      applyTheme(saved);
      set({ themeMode: saved });
    },
  },
}));
