"use client";

import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

type TControlledInputProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
};

export default function ControlledInput({
  name,
  label,
  type = "text",
  placeholder,
  className,
  isRequired = false,
}: TControlledInputProps) {
  const { control } = useFormContext();

  return (
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

          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            value={field.value ?? ""}
            className={className}
          />

          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
