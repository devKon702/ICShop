import { ROLE } from "@/constants/enums";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  name: string;
  email: string;
  avatarUrl: string | null;
  role: ROLE;
  phone: string | null;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean | null;
  actions: {
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    login: (user: User, token: string) => void;
    clearAuth: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: null,
      actions: {
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        login: (user, token) => set({ user, token, isAuthenticated: true }),
        clearAuth: () =>
          set({ user: null, token: null, isAuthenticated: false }),
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
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthActions = () => useAuthStore((state) => state.actions);
