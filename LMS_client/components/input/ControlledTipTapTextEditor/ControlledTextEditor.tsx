"use client";

import { Controller, useFormContext } from "react-hook-form";
import TextEditorTipTap from "./TextEditorTipTap";

type TControlledInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
};

export default function ControlledTextEditor({
  name,
  label,

  placeholder,

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

          <TextEditorTipTap
            {...field}
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder={placeholder ?? "Write Something"}
          />

          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
