import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/className";
import { CalendarDays } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

interface Props {
  defaultRange?: { from: Date; to: Date };
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  shortcutDays?: { days: number; label: string }[];
  required?: true;
  className?: string;
}

export default function DateRangeSelector({
  defaultRange,
  onChange,
  shortcutDays,
  required,
  className,
}: Props) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    defaultRange
  );

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "border rounded-md bg-white cursor-pointer h-full flex items-center justify-center px-2",
            className
          )}
        >
          <CalendarDays />
          <span className="flex-1 text-sm">
            {dateRange
              ? `${new Intl.DateTimeFormat("vi-VI").format(
                  dateRange.from
                )} - ${new Intl.DateTimeFormat("vi-VI").format(dateRange.to)}`
              : "Chọn khoảng ngày"}
          </span>
        </div>
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
            {shortcutDays?.map((shortcut) => (
              <li key={shortcut.days}>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm cursor-pointer text-nowrap"
                  onClick={() => {
                    const to = new Date();
                    const from = new Date();
                    from.setDate(from.getDate() - (shortcut.days - 1));
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
