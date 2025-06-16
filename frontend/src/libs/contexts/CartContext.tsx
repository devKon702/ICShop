"use client";
import React, { createContext, useContext } from "react";

interface CartContextProps {
  list: string[];
}
const CartContext = createContext<CartContextProps | undefined>(undefined);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const list = ["cart"];

  return (
    <CartContext.Provider value={{ list }}>{children}</CartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
