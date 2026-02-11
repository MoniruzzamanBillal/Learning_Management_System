"use client";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";

type TControlledITextAreaProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  rows?: number;
};

export default function ControlledTextArea({
  name,
  label,

  placeholder,
  className,
  isRequired = false,
  rows = 4,
}: TControlledITextAreaProps) {
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

          <Textarea
            {...field}
            rows={rows}
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
