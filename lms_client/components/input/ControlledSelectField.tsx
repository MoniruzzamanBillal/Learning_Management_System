import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface ControlledSelectFieldProps {
  name: string;
  options: Option[];
  placeholder?: string;
  description?: string;
  className?: string;
  label?: string;
  isRequired?: boolean;
}

const ControlledSelectField: React.FC<ControlledSelectFieldProps> = ({
  name,
  options,
  placeholder,
  className,
  label,
  isRequired,
}) => {
  const { control } = useFormContext();

  return (
    <div className="relative w-full">
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

            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger
                className={cn(
                  `flex h-[42px] w-full rounded-md border border-input bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 focus:outline-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                    error
                      ? "border border-rose-500"
                      : "focus:ring-grayDark focus:border-[#D9E3E7]"
                  }`,
                  className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className=" bg-white ">
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && error && (
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

export default ControlledSelectField;
