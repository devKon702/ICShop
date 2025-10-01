import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: { id: number; quantity: number }[];
  actions: {
    addItem: (id: number, quantity: number) => void;
    updateItem: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
  };
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      actions: {
        addItem: (id, quantity) => {
          const items = get().items;
          const existingItem = items.find((item) => item.id === id);
          if (existingItem) {
            existingItem.quantity = quantity;
          } else {
            items.push({ id, quantity });
          }
          set({ items: [...items] });
        },
        updateItem: (id, quantity) => {
          const items = get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          set({ items });
        },
        removeItem: (id) => {
          const items = get().items.filter((item) => item.id !== id);
          set({ items });
        },
        clearCart: () => set({ items: [] }),
      },
    }),
    {
      name: "cart",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartItems = () => useCartStore((state) => state.items);
export default useCartStore;
