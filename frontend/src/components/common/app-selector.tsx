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
import { ButtonHTMLAttributes } from "react";

interface SelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  data: { value: string; label: string }[];
  defaultValue: string;
  className?: string;
  onValueChange: (value: string) => void;
}

export default function AppSelector({
  data,
  defaultValue,
  className,
  onValueChange,
}: SelectorProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger className={cn("cursor-pointer bg-white", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="cursor-pointer"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
