import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface NumberInputFormProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
}

export default function NumberInputForm<TFieldValues extends FieldValues>({
  name,
  label,
  control,
}: NumberInputFormProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold text-gray-700">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
