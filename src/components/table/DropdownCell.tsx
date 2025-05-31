"use client";

import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataWithId {
  id: string;
}

interface DropdownCellProps<TData> extends CellContext<TData, string | null> {
  options: { value: string; label: string; object?: unknown }[];
  objectColumnId?: string;
}

export default function DropdownCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  options,
  objectColumnId,
  table,
}: DropdownCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);

    table.options.meta?.updateData(row.original.id, column.id, currentValue);

    if (!objectColumnId) {
      return;
    }
    for (const option of options) {
      if (option.value !== currentValue) {
        continue;
      }

      table.options.meta?.updateData(
        row.original.id,
        objectColumnId,
        option.object
      );
      return;
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full px-3 justify-between focus-visible:ring-0 border-0 shadow-none bg-transparent"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
