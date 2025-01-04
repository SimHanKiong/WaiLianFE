import { Label } from '@radix-ui/react-label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Control, FieldValues, Path } from 'react-hook-form';

interface RadioInputFormProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  options: { value: boolean | string; label: string }[];
}

export default function RadioInputForm<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  options,
}: RadioInputFormProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                const parsedValue = options.some(
                  (opt) => typeof opt.value === 'boolean'
                )
                  ? value === 'true'
                  : value;
                field.onChange(parsedValue);
              }}
              value={field.value?.toString() || ''}
              className="space-y-2"
            >
              {options.map((option) => (
                <div
                  key={option.value.toString()}
                  className="flex items-center space-x-3"
                >
                  <RadioGroupItem
                    value={String(option.value)}
                    id={`${name}-${String(option.value)}`}
                    className="w-5 h-5 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Label
                    htmlFor={`${name}-${String(option.value)}`}
                    className="text-gray-700 font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
