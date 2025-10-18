"use client";
import Counter from "@/components/common/counter";
import cartService from "@/libs/services/cart.service";
import useCartStore from "@/store/cart-store";
import { cn } from "@/utils/className";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface AddToCartFormProps {
  productId: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function AddToCartForm({
  productId,
  min = 1,
  max = 999,
  step = 1,
  className = "",
}: AddToCartFormProps) {
  const [count, setCount] = React.useState(1);
  const {
    actions: { addItem },
  } = useCartStore();
  const queryClient = useQueryClient();
  const { mutate: addToCartMutate } = useMutation({
    mutationFn: async () => cartService.add(productId),
    onSuccess: ({ data }) => {
      toast.success("Thêm vào giỏ hàng thành công");
      addItem(data.id, count);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Thêm vào giỏ hàng thất bại");
    },
  });

  return (
    <div className={cn(className)}>
      <Counter
        min={min}
        max={999}
        value={count}
        onDownClick={() => setCount(count - step < min ? min : count - step)}
        onUpClick={() => setCount(count + step > max ? max : count + step)}
        onInputChange={(e) => {
          const val: unknown = +e.target.value;
          if (typeof val != "number") return;

          setCount(Math.max(min, Math.min(max, val)));
        }}
      ></Counter>
      <button
        className="bg-primary hover:opacity-90 py-2 cursor-pointer rounded-sm w-full mt-2"
        onClick={() => addToCartMutate()}
      >
        <i className="bx bxs-cart me-2 pointer-events-none"></i>
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
