import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "Admin" | "Customer";

export interface AuthState {
  isAuthenticated: boolean;
  authInitialized: boolean;
  roles: UserRole[];
  userId?: string;
  displayName?: string;
  email?: string;

  setAuth: (
    userId: string,
    roles: UserRole[],
    displayName?: string,
    email?: string
  ) => void;
  setAuthInitialized: (initialized: boolean) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authInitialized: false,
      roles: [],
      userId: undefined,
      displayName: undefined,
      email: undefined,

      setAuthInitialized: (initialized) => {
        set({ authInitialized: initialized });
      },

      setAuth: (userId, roles, displayName, email) => {
        const normalizedRoles = roles.map(
          (role) =>
            (role.charAt(0).toUpperCase() +
              role.slice(1).toLowerCase()) as UserRole
        );
        set({
          isAuthenticated: true,
          authInitialized: true,
          userId,
          roles: normalizedRoles,
          displayName,
          email,
        });
      },

      logout: () => {
        useAuthStore.persist.clearStorage();
        set({
          isAuthenticated: false,
          authInitialized: true,
          roles: [],
          userId: undefined,
          displayName: undefined,
          email: undefined,
        });
      },

      clearAuth: () => {
        useAuthStore.persist.clearStorage();
        set({
          isAuthenticated: false,
          authInitialized: true,
          roles: [],
          userId: undefined,
          displayName: undefined,
          email: undefined,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        authInitialized: state.authInitialized,
        roles: state.roles,
        displayName: state.displayName,
        email: state.email,
        userId: state.userId,
      }),
    }
  )
);
