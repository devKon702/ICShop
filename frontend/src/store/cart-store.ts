import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

type SelectedProduct = {
  id: number;
  name: string;
  posterUrl: string;
  quantity: number;
  cartId: number;
  wholesale: {
    details: { min: number; price: string }[];
    vat: string;
    unit: string;
  };
};

interface CartState {
  items: { id: number; quantity: number }[];
  selectedProducts: SelectedProduct[];
  actions: {
    addItem: (cartId: number, quantity: number) => void;
    updateItem: (cartId: number, quantity: number) => void;
    removeItem: (cartId: number) => void;
    clearCart: () => void;
    selectProduct: (item: SelectedProduct) => void;
    unselectProduct: (id: number) => void;
  };
}

const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        selectedProducts: [],
        actions: {
          addItem: (id, quantity) => {
            const items = get().items;
            const existingItem = items.find((item) => item.id === id);
            if (existingItem) {
              existingItem.quantity = quantity;
              const selectedProducts = get().selectedProducts.map((item) =>
                item.cartId === id ? { ...item, quantity } : item
              );
              set({ selectedProducts: [...selectedProducts] });
            } else {
              items.push({ id, quantity });
            }
            set({ items: [...items] });
          },
          updateItem: (id, quantity) => {
            const items = get().items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            );
            const selectedProducts = get().selectedProducts.map((item) =>
              item.cartId === id ? { ...item, quantity } : item
            );
            set({ items: [...items], selectedProducts: [...selectedProducts] });
          },
          removeItem: (id) => {
            const items = get().items.filter((item) => item.id !== id);
            const selectedProducts = get().selectedProducts.filter(
              (item) => item.cartId !== id
            );
            set({ items: [...items], selectedProducts: [...selectedProducts] });
          },
          selectProduct: (item: SelectedProduct) => {
            const selectedProducts = get().selectedProducts;
            const existingItem = selectedProducts.find(
              (i) => i.cartId === item.cartId
            );
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              item.wholesale.details.sort((a, b) => a.min - b.min);
              selectedProducts.push(item);
            }
            set({ selectedProducts: [...selectedProducts] });
          },
          unselectProduct: (cartId: number) => {
            const selectedProducts = get().selectedProducts.filter(
              (item) => item.cartId !== cartId
            );
            set({ selectedProducts: [...selectedProducts] });
          },
          clearCart: () => set({ items: [], selectedProducts: [] }),
        },
      }),
      {
        name: "cart",
        partialize: (state) => ({
          items: state.items,
        }),
      }
    )
  )
);

export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartItems = () => useCartStore((state) => state.items);
export const useSelectedProducts = () =>
  useCartStore((state) => state.selectedProducts);
export default useCartStore;
