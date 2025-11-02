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

type Option<T extends string> = {
  value: T;
  label: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SelectorProps<T extends readonly Option<any>[]>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  data: T;
  defaultValue?: T[number]["value"];
  className?: string;
  onValueChange: (value: T[number]["value"]) => void;
  disableValues?: T[number]["value"][];
  disableOutsideClick?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AppSelector<T extends readonly Option<any>[]>({
  data,
  defaultValue,
  className,
  onValueChange,
  disableValues,
  disableOutsideClick = false,
}: SelectorProps<T>) {
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
