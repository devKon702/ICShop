import CartHeader from "@/components/features/cart/cart-header";
import CartList from "@/components/features/cart/cart-list";
import CartSummary from "@/components/features/cart/cart-summary";
import CartProvider from "@/libs/contexts/CartContext";
import React from "react";

export default function CartPage() {
  return (
    <CartProvider>
      <div className="grid grid-cols-12 space-x-3">
        <div className="col-span-9 rounded-md bg-white p-2 shadow-md">
          <h1 className="font-medium text-2xl p-2">Giỏ hàng</h1>
          <CartHeader />
          <CartList />
        </div>
        <div className="col-span-3 rounded-md bg-white px-2 py-4 h-fit shadow-md">
          <CartSummary />
        </div>
      </div>
    </CartProvider>
  );
}
