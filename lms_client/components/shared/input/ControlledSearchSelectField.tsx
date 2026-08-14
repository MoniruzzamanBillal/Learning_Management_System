"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type TControlledSearchSelectFieldProps = {
  name: string;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  className?: string;
  isRequired?: boolean;
};

const ControlledSearchSelectField = ({
  name,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  label,
  className,
  isRequired,
}: TControlledSearchSelectFieldProps) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative ">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium">
                {label}
                {isRequired && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    `flex h-[42px] w-full max-w-xs justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                      error
                        ? "border-rose-500"
                        : "focus:ring-grayDark focus:border-[#D9E3E7]"
                    }`,
                    className,
                  )}
                >
                  {field.value
                    ? options.find((opt) => opt.value === field.value)?.label
                    : placeholder}

                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.value}
                          onSelect={(currentValue) => {
                            field.onChange(
                              currentValue === field.value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          {opt.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === opt.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {error && (
              <div className="text-rose-500 text-xs mt-1 pl-2">
                {error.message}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ControlledSearchSelectField;
