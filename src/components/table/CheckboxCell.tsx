"use client";

import { CellContext } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";

interface DataWithId {
  id: string;
}

export default function CheckboxCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, boolean>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleCheckedChange = () => {
    const newValue = !value;
    setValue(newValue);
    table.options.meta?.updateData(row.original.id, column.id, newValue);
  };

  return (
    <div className="flex justify-center">
      <Checkbox
        className="size-6 data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
        checked={value}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
