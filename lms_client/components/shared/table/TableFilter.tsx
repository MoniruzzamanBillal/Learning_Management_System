"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersVertical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export type TTableFilterOption = {
  label: string;
  value: string;
};

export type TTableFilterGroup = {
  key: string;
  label: string;
  options: TTableFilterOption[];
};

export type TTableFilterPopoverProps = {
  filters: TTableFilterGroup[];
  value: Record<string, string[]>;
  onChange: (val: Record<string, string[]>) => void;
};

export default function TableFilter({
  filters,
  value,
  onChange,
}: TTableFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (
    groupKey: string,
    optionValue: string,
    checked: boolean,
  ) => {
    const existing = value[groupKey] || [];

    const updated = checked
      ? [...existing, optionValue]
      : existing.filter((v) => v !== optionValue);

    onChange({
      ...value,
      [groupKey]: updated,
    });
  };

  const handleReset = () => {
    onChange({});
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="bg-neutral-600 border border-neutral-700 py-2.5 px-3 rounded-[8px] flex items-center gap-x-2 cursor-pointer">
        <div className="   ">
          <SlidersVertical className=" text-neutral-50 " />
        </div>
        <span className="font-semibold text-[0.875rem] text-neutral-50 ">
          Filter
        </span>
      </PopoverTrigger>

      <PopoverContent className="p-5 space-y-4 w-[300px] bg-neutral-600 ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-[1rem] text-neutral-50">Filters</h1>

          <div
            onClick={handleReset}
            className="flex items-center gap-x-1 text-neutral-400 cursor-pointer"
          >
            <X size={16} />
            <span className="border-b border-neutral-400 font-bold text-[14px]">
              Reset
            </span>
          </div>
        </div>

        {/* Dynamic Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {filters.map((group) => (
            <AccordionItem
              key={group.key}
              value={group.key}
              className="border border-table-border rounded-[8px] overflow-hidden"
            >
              <AccordionTrigger className="bg-neutral-700 text-neutral-100 py-2.5 px-3 font-medium text-[14px] rounded-none">
                {group.label}
              </AccordionTrigger>

              <AccordionContent className="p-3 space-y-4 ">
                {group.options.map((option) => {
                  const isChecked =
                    value[group.key]?.includes(option.value) ?? false;

                  return (
                    <div
                      key={option.value}
                      className="flex items-center gap-x-2"
                    >
                      <Checkbox
                        className="  border-neutral-400  data-[state=checked]:bg-red-500 data-[state=checked]:border-neutral-300 data-[state=checked]:text-neutral-100 "
                        id={`${group.key}-${option.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            group.key,
                            option.value,
                            !!checked,
                          )
                        }
                      />

                      <label
                        htmlFor={`${group.key}-${option.value}`}
                        className="  text-[0.875rem] font-medium cursor-pointer text-neutral-200 "
                      >
                        {option.label}
                      </label>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-x-3 pt-4">
          <Button
            type="button"
            onClick={() => {
              handleReset();
              setOpen(false);
            }}
            className=" cursor-pointer border border-neutral-500 text-neutral-200 p-3 font-semibold text-[0.875rem] leading-5.25 rounded-[8px] bg-transparent hover:bg-transparent  "
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className="  cursor-pointer border border-primary-600  bg-primary-500 hover:bg-primary-600 p-3 text-[0.875rem] leading-5.25 rounded-[8px] font-semibold  text-neutral-100"
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
