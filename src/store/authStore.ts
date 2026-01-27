import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "Admin" | "Customer";

export interface AuthState {
  isAuthenticated: boolean;
  roles: UserRole[];
  userId?: string;
  displayName?: string;
  email?: string;

  hasHydrated: boolean;

  setAuth: (
    userId: string,
    roles: UserRole[],
    displayName?: string,
    email?: string,
  ) => void;

  logout: () => void;
  clearAuth: () => void;
}

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
        localStorage.removeItem("auth-storage");
        set({ ...initialAuth, hasHydrated: true });
      },

      clearAuth: () => {
        localStorage.removeItem("auth-storage");
        set({ ...initialAuth, hasHydrated: true });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
        displayName: state.displayName,
        email: state.email,
        userId: state.userId,
      }),

      // ✅ CORRECT hydration handling
      onRehydrateStorage: () => (state, error) => {
        if (error) alert(`[AUTH] ❌ Failed to hydrate auth store: ${error}`);
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
