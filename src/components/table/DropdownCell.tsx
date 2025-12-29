"use client";

import { CellContext } from "@tanstack/react-table";
import { Check, ChevronsUpDown } from "lucide-react";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import BaseCell from "./BaseCell";
import { DataWithId } from "./EditableTable";

interface DropdownCellProps<TData> extends CellContext<TData, string | null> {
  options: { value: string; label: string; object?: unknown }[];
  objectColumnId?: string;
  backgroundColour?: string;
  textColour?: string;
  className?: string;
  buttonClassName?: string;
  serverUpdate?: {
    id: string;
    field: string;
    action: (id: string, dataUpdate: Record<string, unknown>) => Promise<void>;
  };
}

export default function DropdownCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  options,
  objectColumnId,
  table,
  backgroundColour = "transparent",
  textColour,
  buttonClassName,
  serverUpdate,
}: DropdownCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSelect = (currentValue: string) => {
    const value = currentValue === "" ? null : currentValue;
    setValue(value);
    setOpen(false);

    const selectedOption = options.find((opt) => opt.value === value);

    if (serverUpdate && serverUpdate.id) {
      const { id, field, action } = serverUpdate;
      action(id, { [field]: value });
    }

    table.options.meta?.updateData(row.original.id, column.id, value);
    if (objectColumnId && selectedOption) {
      table.options.meta?.updateData(
        row.original.id,
        objectColumnId,
        selectedOption.object
      );
    }
  };

  return (
    <BaseCell
      padding="none"
      align="center"
      style={{ backgroundColor: backgroundColour }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            style={{ color: textColour }}
            className={cn(
              "w-full justify-between border-0 bg-transparent px-3 shadow-none hover:bg-transparent focus-visible:ring-0",
              buttonClassName
            )}
          >
            {value ? (
              options.find((option) => option.value === value)?.label
            ) : (
              <span></span>
            )}
            <ChevronsUpDown className="opacity-50 text-black" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput />
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
    </BaseCell>
  );
}
