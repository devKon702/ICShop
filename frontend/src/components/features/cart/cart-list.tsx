"use client";
import CartItem from "@/components/features/cart/cart-item";
import React from "react";
interface CartListProps {
  items: {
    id: number;
    product: {
      id: number;
      name: string;
      posterUrl: string;
      slug: string;
      quantity: number;
      wholesale: {
        vat: string;
        max_quantity: number;
        min_quantity: number;
        step: number;
        unit: string;
        details: { min: number; price: string; desc: string }[];
      };
    };
  }[];
}

export default function CartList({ items }: CartListProps) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <CartItem
          key={item.id}
          cartId={item.id}
          product={{
            id: item.product.id,
            name: item.product.name,
            posterUrl: item.product.posterUrl,
            slug: item.product.slug,
            wholesale: {
              vat: item.product.wholesale.vat,
              details: item.product.wholesale.details,
              max_quantity: item.product.wholesale.max_quantity,
              min_quantity: item.product.wholesale.min_quantity,
              quantity_step: item.product.wholesale.step,
              unit: item.product.wholesale.unit,
            },
            quantity: item.product.quantity,
          }}
        />
      ))}
    </div>
  );
}
