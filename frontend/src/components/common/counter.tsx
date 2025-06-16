"use client";
import { cn } from "@/utils/className";
import React from "react";

interface CounterProps {
  onDownClick: () => void;
  onUpClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  value: number;
  buttonClassname?: string;
}
export default function Counter({
  value,
  min,
  max,
  onDownClick,
  onUpClick,
  onInputChange,
  buttonClassname,
}: CounterProps) {
  return (
    <div className="flex border rounded-md">
      <CountButton
        type="minus"
        onClick={onDownClick}
        className={buttonClassname}
      ></CountButton>
      <input
        value={value}
        type="number"
        min={min}
        max={max}
        className="flex-1 text-center bg-white"
        onChange={onInputChange}
      />
      <CountButton
        type="plus"
        onClick={onUpClick}
        className={buttonClassname}
      ></CountButton>
    </div>
  );
}

interface CountButtonProps {
  type: "plus" | "minus";
  onClick: () => void;
  className?: string;
}
function CountButton({ type, onClick, className }: CountButtonProps) {
  return (
    <button>
      <i
        className={cn(
          `bx bx-${type} bg-background opacity-70 hover:opacity-100 py-2 px-6 cursor-pointer`,
          className
        )}
        onClick={onClick}
      ></i>
    </button>
  );
}
