"use client";

import { useSelectedProducts } from "@/store/cart-store";
import { formatPrice, getUnitPrice } from "@/utils/price";
import React from "react";
import { Decimal } from "decimal.js";
import { Button } from "@/components/ui/button";
import { useModalActions } from "@/store/modal-store";

export default function CartSummary() {
  const selectedProducts = useSelectedProducts();
  const { openModal } = useModalActions();
  return (
    <div>
      <p className="font-bold text-2xl mb-5">Tổng đơn hàng</p>
      <div className="my-2 space-x-2 flex justify-between">
        <span className="font-medium">Số lượng:</span>
        <span>{selectedProducts.length}</span>
      </div>
      <div className="w-full h-[4px] bg-black"></div>
      <div className="my-2 space-x-2 flex justify-between">
        <span className="font-bold text-xl">Thành tiền:</span>
        <span>
          {formatPrice(
            selectedProducts
              .reduce((total, item) => {
                return total.add(
                  getUnitPrice(
                    item.quantity,
                    item.wholesale.details.map((item) => ({
                      min: item.min,
                      price: item.price,
                    }))
                  ) * item.quantity
                );
              }, new Decimal(0))
              .toNumber()
          )}
        </span>
      </div>
      <Button
        className="w-full bg-primary font-bold text-white py-2 cursor-pointer opacity-80 hover:opacity-100"
        onClick={() => openModal({ type: "orderConfirmation", props: {} })}
        disabled={selectedProducts.length === 0}
      >
        <span className="pointer-events-none">Xác nhận đơn hàng</span>
      </Button>
    </div>
  );
}
