import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clearAuthTokens } from "../api/core/http";

export type UserRole = "Admin" | "Customer";

export interface AuthState {
  isAuthenticated: boolean;
  roles: UserRole[];
  userId?: string;
  displayName?: string;
  email?: string;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setAuth: (
    userId: string,
    roles: UserRole[],
    displayName?: string,
    email?: string,
  ) => void;

  logout: () => void;
  clearAuth: () => void;
}

const STORAGE_KEY = "auth-storage";
const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => localStorage)
    : undefined;

const initialAuth = {
  isAuthenticated: false,
  roles: [] as UserRole[],
  userId: undefined as string | undefined,
  displayName: undefined as string | undefined,
  email: undefined as string | undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialAuth,

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      setAuth: (userId, roles, displayName, email) => {
        const normalizedRoles = roles.map(
          (role) =>
            (role.charAt(0).toUpperCase() +
              role.slice(1).toLowerCase()) as UserRole,
        );

        set({
          isAuthenticated: true,
          userId,
          roles: normalizedRoles,
          displayName,
          email,
        });
      },

      logout: () => {
        clearAuthTokens();
        storage?.removeItem(STORAGE_KEY);
        set({ ...initialAuth, hasHydrated: true });
      },

      clearAuth: () => {
        clearAuthTokens();
        storage?.removeItem(STORAGE_KEY);
        set({ ...initialAuth, hasHydrated: true });
      },
    }),
    {
      name: STORAGE_KEY,
      storage,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
        displayName: state.displayName,
        email: state.email,
        userId: state.userId,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) console.error("Failed to hydrate auth store:", error);

        state?.setHasHydrated(true);
      },
    },
  ),
);
