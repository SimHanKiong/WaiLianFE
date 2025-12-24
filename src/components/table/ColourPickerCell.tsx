// src/components/table/ColorPickerCell.tsx
"use client";

import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import { DataWithId } from "./EditableTable";
import { Input } from "../ui/input";

export default function ColourPickerCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, string>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex items-center gap-2 px-2">
      <Input
        type="color"
        value={value || "#000000"}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          table.options.meta?.updateData(row.original.id, column.id, value);
        }}
        className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
      />
      <span className="text-xs text-gray-500">{value}</span>
    </div>
  );
}
