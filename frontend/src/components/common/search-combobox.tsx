"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/className";

interface Props<T extends string | number>
  extends React.HTMLAttributes<HTMLButtonElement> {
  list: {
    value: T;
    label: string;
  }[];
  searchPlaceholder: string;
  onItemSelect?: (item: Props<T>["list"][number]) => void;
  initialValue?: T | null;
  disableValues?: T[];
}

export default function SearchCombobox<T extends string | number>({
  list,
  searchPlaceholder,
  onItemSelect,
  initialValue = null,
  className,
  disableValues = [],
}: Props<T>) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<
    Props<T>["list"][number] | null
  >(list.find((item) => item.value === initialValue) || null);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between cursor-pointer", className)}
        >
          {selected ? selected.label : searchPlaceholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Không có dữ liệu</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  disabled={
                    disableValues.includes(item.value) ||
                    item.value == selected?.value
                  }
                  onSelect={() => {
                    setOpen(false);
                    setSelected(item);
                    onItemSelect?.(item);
                  }}
                  className="cursor-pointer"
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selected?.label === item.label
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
