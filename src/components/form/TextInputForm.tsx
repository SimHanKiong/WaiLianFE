import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface TextInputFormProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  placeholder: string;
  maxLength?: number;
}

export default function TextInputForm<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  maxLength,
}: TextInputFormProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              {...field}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm"
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
