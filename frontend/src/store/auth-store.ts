import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "user" | "admin";
};

interface AuthState {
  user: User | null;
  token: string | null;
  actions: {
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    login: (user: User, token: string) => void;
    clearAuth: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      actions: {
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        login: (user, token) => set({ user, token }),
        clearAuth: () => set({ user: null, token: null }),
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({
        // user: state.user,
        token: state.token,
      }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useAuthActions = () => useAuthStore((state) => state.actions);
