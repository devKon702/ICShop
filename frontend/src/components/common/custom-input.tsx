import { cn } from "@/utils/className";
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  icon?: React.ReactNode;
  placeholder?: string;
  isError: boolean;
  disable?: boolean;
  iconAlign?: "start" | "end";
  min?: string;
  max?: string;
}

export default function CustomInput({
  className,
  type,
  icon,
  placeholder,
  isError,
  disable = false,
  iconAlign = "start",
  min,
  max,
  ...otherProps
}: InputProps) {
  return (
    <div
      className={`w-full flex items-center border-2 rounded-sm overflow-hidden ${
        isError && "border-red-400"
      }`}
    >
      {iconAlign === "start" && icon}
      <input
        type={type}
        className={cn(
          "inline-block outline-none border-none flex-1 p-2 w-full",
          className
        )}
        placeholder={placeholder}
        disabled={disable}
        min={min}
        max={max}
        {...otherProps}
      />
      {iconAlign === "end" && icon}
      {isError && <i className="bx bx-error-circle text-red-400 ml-2 px-2"></i>}
    </div>
  );
}
