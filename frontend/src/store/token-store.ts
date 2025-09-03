import { create } from "zustand";
import { persist } from "zustand/middleware";
interface TokenState {
  token: string | null;
  actions: {
    setToken: (token: string) => void;
    clear: () => void;
  };
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      actions: {
        setToken: (token: string) => set({ token }),
        clear: () => set({ token: null }),
      },
    }),
    { name: "token" }
  )
);

export const useTokenActions = () => useTokenStore((state) => state.actions);
