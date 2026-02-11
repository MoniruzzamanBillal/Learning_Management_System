import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
interface ControlledMultiSelectFieldProps {
  name: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  label?: string;
  isRequired?: boolean;
}

const ControlledMultiSelectField: React.FC<ControlledMultiSelectFieldProps> = ({
  name,
  options,
  placeholder,
  label,
  isRequired = false,
}) => {
  const { control } = useFormContext();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative w-full `} ref={containerRef}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium">
                {label}
                {isRequired && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            <CreatableSelect
              isMulti
              options={options}
              value={options.filter(
                (opt) => field.value?.includes(opt.value),
                // field.value?.includes(Number(opt.value))
              )}
              placeholder={placeholder || "Select options"}
              onChange={(selected) => {
                field.onChange(selected.map((opt) => opt.value));
                // field.onChange(selected.map((opt) => Number(opt.value)));
              }}
              onCreateOption={(inputValue) => {
                const newOption = {
                  label: inputValue,
                  value: String(Date.now()),
                };
                field.onChange([...field.value, Number(newOption.value)]);
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default ControlledMultiSelectField;
