import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/className";
import { getDateAgo } from "@/utils/date";
import { CalendarDays } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

interface Props {
  defaultRange?: { from: Date; to: Date };
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  shortcuts?: {
    value: number | `${number}${"d" | "m" | "y" | "w"}` | null;
    label: string;
  }[];
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export default function DateRangeSelector({
  defaultRange,
  onChange,
  shortcuts,
  required,
  className,
  placeholder,
}: Props) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    defaultRange
  );

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "border rounded-md bg-white cursor-pointer h-full flex items-center justify-center px-2",
          className
        )}
      >
        <CalendarDays className="p-1" />
        <span className="flex-1 text-sm">
          {dateRange?.from && dateRange?.to
            ? `${new Intl.DateTimeFormat("vi-VI").format(
                dateRange.from
              )} - ${new Intl.DateTimeFormat("vi-VI").format(dateRange.to)}`
            : placeholder || "Chọn khoảng ngày"}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <Calendar
            mode="range"
            disabled={{
              after: new Date(),
            }}
            selected={dateRange}
            onSelect={(range: DateRange | undefined) => {
              const { from, to } = range || {};
              setDateRange({ from, to });
              onChange?.({ from, to });
            }}
            captionLayout="dropdown"
            className="bg-white"
            required={required}
          />
          <ul className="flex gap-2 mt-3 flex-wrap w-full">
            {shortcuts?.map((shortcut) => (
              <li key={shortcut.value}>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm cursor-pointer text-nowrap"
                  onClick={() => {
                    if (shortcut.value === 0 || shortcut.value === null) {
                      setDateRange(undefined);
                      onChange?.({ from: undefined, to: undefined });
                      return;
                    }
                    const to = new Date();
                    const from = getDateAgo(
                      typeof shortcut.value === "number"
                        ? `${shortcut.value}d`
                        : shortcut.value
                    );
                    const range = { from, to };
                    setDateRange(range);
                    onChange?.(range);
                  }}
                >
                  {shortcut.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
