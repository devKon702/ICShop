"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/className";
import React, { ButtonHTMLAttributes } from "react";

interface SelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  data: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
  onValueChange: (value: string) => void;
  disableValues?: string[];
  disableOutsideClick?: boolean;
}

export default function AppSelector({
  data,
  defaultValue,
  className,
  onValueChange,
  disableValues,
  disableOutsideClick = false,
}: SelectorProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger className={cn("cursor-pointer bg-white", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        {...(disableOutsideClick && {
          onPointerDownOutside: (e) => e.preventDefault(),
        })}
      >
        <SelectGroup>
          {data.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="cursor-pointer hover:bg-gray-100"
              disabled={disableValues?.includes(item.value)}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
