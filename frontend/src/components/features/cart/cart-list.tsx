import CartItem from "@/components/features/cart/cart-item";
import React from "react";

export default function CartList() {
  return (
    <div className="flex flex-col">
      <CartItem></CartItem>
      <CartItem></CartItem>
      <CartItem></CartItem>
    </div>
  );
}
