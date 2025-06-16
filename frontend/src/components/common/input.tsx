import { cn } from "@/utils/className";
import React from "react";

interface InputProps {
  className?: string;
  type: string;
  icon?: React.ReactElement;
  placeholder?: string;
  isError: boolean;
  disable?: boolean;
}

export default function Input({
  className,
  type,
  icon,
  placeholder,
  isError,
  disable = false,
  ...otherProps
}: InputProps) {
  return (
    <div
      className={`w-full flex items-center space-x-2 border-2 rounded-sm overflow-hidden ${
        isError && "border-red-400"
      }`}
    >
      {icon}
      <input
        type={type}
        className={cn("outline-none border-none flex-1 p-2", className)}
        placeholder={placeholder}
        disabled={disable}
        {...otherProps}
      />
      {isError && <i className="bx bx-error-circle text-red-400 px-2"></i>}
    </div>
  );
}
