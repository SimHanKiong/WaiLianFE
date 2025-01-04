import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

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
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
