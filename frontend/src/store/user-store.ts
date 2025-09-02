import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: "user" | "admin";
};

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  actions: {
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    login: (user: User, token: string) => void;
    logout: () => void;
  };
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  actions: {
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    login: (user, token) => {
      set({ user, token, isAuthenticated: true });
    },
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useToken = () => useUserStore((state) => state.token);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated);
export const useUserActions = () => useUserStore((state) => state.actions);
