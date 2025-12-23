"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Input } from "../ui/input";

interface DateInputFormProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  minDate?: Date;
  maxDate?: Date;
}

export default function DateInputForm<TFieldValues extends FieldValues>({
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
          <FormLabel className="font-semibold text-gray-700">{label}</FormLabel>
          <div className="relative flex items-center">
            <FormControl>
              <Input
                type="date"
                {...field}
                className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm"
                value={format(field.value, "yyyy-MM-dd")}
                onChange={(e) => {
                  const parsedDate = parseISO(e.target.value);
                  if (Number.isFinite(parsedDate.getTime())) {
                    field.onChange(parsedDate);
                  }
                }}
                onClick={(e) => e.preventDefault()}
              />
            </FormControl>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 rounded-full"
                  type="button"
                >
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
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
                  captionLayout="dropdown"
                  startMonth={
                    minDate ?? new Date(new Date().getFullYear() - 100, 0, 1)
                  }
                  endMonth={
                    maxDate ?? new Date(new Date().getFullYear() + 10, 11, 31)
                  }
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
