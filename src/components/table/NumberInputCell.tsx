"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";

interface DataWithId {
  id: string;
}

export default function NumberInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, number>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      className="focus-visible:ring-0 border-0 shadow-none"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={() => {
        table.options.meta?.updateData(row.original.id, column.id, value);
      }}
      type="number"
    />
  );
}
