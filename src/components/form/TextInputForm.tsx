import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface TextInputFormProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  placeholder: string;
  maxLength?: number;
  type?: string;
}

export default function TextInputForm<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  maxLength,
  type = "text",
}: TextInputFormProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold text-gray-700">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm"
              placeholder={placeholder}
              maxLength={maxLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
