"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useFormContext } from "react-hook-form";

type TControlledCheckboxProps = {
  name: string;
  label?: string;
  className?: string;
  isRequired?: boolean;
  disabled?: boolean;
};

export default function ControlledCheckbox({
  name,
  label,
  className,
  isRequired = false,
  disabled = false,
}: TControlledCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={className}
            />

            {label && (
              <label
                htmlFor={name}
                className="  text-sm sm:text-base leading-6 tracking-normal font-medium text-neutral-700 dark:text-neutral-50 cursor-pointer"
              >
                {label}
                {isRequired && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
