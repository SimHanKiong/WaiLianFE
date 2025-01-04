'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Control, FieldValues, Path } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '../ui/input';

interface DateInputFormProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  minDate?: Date;
  maxDate?: Date;
}

export function DateInputForm<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  minDate,
  maxDate,
}: DateInputFormProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
          <div className="relative flex items-center">
            {/* Native Date Input */}
            <FormControl>
              <Input
                type="date"
                {...field}
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm"
                value={format(field.value, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedDate = parseISO(value);
                  field.onChange(parsedDate);
                }}
                onClick={(e) => e.preventDefault()}
              />
            </FormControl>

            {/* Calendar Popover */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2"
                  type="button"
                >
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setIsOpen(false);
                  }}
                  disabled={(date) =>
                    (minDate && date < minDate) ||
                    (maxDate && date > maxDate) ||
                    false
                  }
                  defaultMonth={field.value || undefined}
                  initialFocus={true}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
