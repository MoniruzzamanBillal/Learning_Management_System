"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarRange } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type TDateSelectProps = {
  value?: Date | DateRange;
  onChange: (date: Date | DateRange | undefined) => void;
  mode?: "single" | "range";
  placeholder?: string;
};

export default function DateSelect({
  placeholder,
  value,
  onChange,
  mode = "single",
}: TDateSelectProps) {
  const [open, setOpen] = useState(false);

  const isRange = mode === "range";

  const formatDate = () => {
    if (!value) return placeholder ?? "Select Date";

    if (!isRange && value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (isRange && typeof value === "object" && "from" in value) {
      if (value.from && value.to) {
        return `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`;
      }

      if (value.from) {
        return value.from.toLocaleDateString();
      }
    }

    return placeholder ?? "Select Date";
  };

  const defaultMonth =
    value instanceof Date
      ? value
      : typeof value === "object" && value?.from
        ? value.from
        : undefined;

  const handleSingleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    onChange(range);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="border border-neutral-700 py-2.5 px-3 rounded-[8px] flex items-center gap-x-2 cursor-pointer">
        <div>
          <CalendarRange className=" size-5 " />
        </div>

        <span className="font-semibold text-[0.875rem] text-neutral-500">
          {formatDate()}
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={value as Date | undefined}
            onSelect={handleSingleSelect}
            defaultMonth={defaultMonth}
            captionLayout="dropdown"
            className="bg-surface border border-table-border"
          />
        ) : (
          <Calendar
            mode="range"
            selected={value as DateRange | undefined}
            onSelect={handleRangeSelect}
            defaultMonth={defaultMonth}
            captionLayout="dropdown"
            className="bg-surface border border-table-border"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
