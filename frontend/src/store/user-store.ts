import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "user" | "admin";
};

interface UserState {
  user: User | null;
  actions: {
    setUser: (user: User) => void;
  };
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  actions: {
    setUser: (user) => set({ user }),
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
