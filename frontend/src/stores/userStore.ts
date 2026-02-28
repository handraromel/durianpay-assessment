/**
 * User state management with Zustand
 * Manages authentication state and user data
 */

import type { User } from "@/types/auth";
import { clearTokens, setTokens } from "@/utils/token";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setAuth: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
