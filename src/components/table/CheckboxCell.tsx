"use client";

import { CellContext } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";

interface DataWithId {
  id: string;
}

interface CheckboxCellProps<TData> extends CellContext<TData, boolean> {
  updateCellAction: (id: string, dataUpdate: Partial<TData>) => Promise<void>;
}

export default function CheckboxCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  // table,
  updateCellAction,
}: CheckboxCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleCheckedChange = () => {
    const newValue = !value;
    setValue(newValue);
    // table.options.meta?.updateData(row.index, column.id, newValue);
    updateCellAction(row.original.id, {
      [column.id]: newValue,
    } as Partial<TData>);
  };

  return (
    <div className="flex justify-center">
      <Checkbox
        className="h-6 w-6 items-center data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
        checked={value}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
