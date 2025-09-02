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
  };
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  actions: {
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
  },
}));

export const useUser = () => useUserStore.getState().user;
export const useToken = () => useUserStore.getState().token;
export const useIsAuthenticated = () => useUserStore.getState().isAuthenticated;
export const useUserActions = () => useUserStore.getState().actions;
