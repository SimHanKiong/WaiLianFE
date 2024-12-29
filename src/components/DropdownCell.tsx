'use client';

import { useEffect, useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataWithId {
  id: string;
}

interface DropdownCellProps<TData> extends CellContext<TData, string | null> {
  width: number;
  options: { value: string; label: string }[];
  updateCellAction: (id: string, dataUpdate: Partial<TData>) => Promise<void>;
}

export default function DropdownCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  options,
  updateCellAction,
  width,
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
    updateCellAction(row.original.id, {
      [column.id]: currentValue,
    } as Partial<TData>);
  };

  return (
    <div className="flex justify-center items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            style={{ width: `${width}px` }}
            className="justify-between focus-visible:ring-0 border-0 shadow-none bg-transparent"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : 'Select...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: `${width}px` }} className="p-0">
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
                        'ml-auto',
                        value === option.value ? 'opacity-100' : 'opacity-0'
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
