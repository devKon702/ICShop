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
import { parseAsStringLiteral, useQueryStates } from "nuqs";
import { ButtonHTMLAttributes } from "react";

interface SelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  data: { value: string; label: string }[];
  defaultValue: string;
  className?: string;
}

export default function OrderSelector({
  data,
  defaultValue,
  className,
}: SelectorProps) {
  const [query, setQuery] = useQueryStates(
    {
      order: parseAsStringLiteral(data.map((item) => item.value)).withDefault(
        defaultValue || data[0].value
      ),
    },
    { shallow: false }
  );
  return (
    <Select
      onValueChange={(value) => setQuery({ ...query, order: value })}
      defaultValue={query.order}
    >
      <SelectTrigger className={cn("cursor-pointer bg-white", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
