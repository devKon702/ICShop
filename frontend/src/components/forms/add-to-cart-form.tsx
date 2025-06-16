"use client";
import Counter from "@/components/common/counter";
import React from "react";

interface AddToCartFormProps {
  product?: unknown;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function AddToCartForm({
  min = 1,
  max = 999,
  step = 1,
  className = "",
}: AddToCartFormProps) {
  const [count, setCount] = React.useState(1);
  return (
    <div className={className}>
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
    </div>
  );
}
