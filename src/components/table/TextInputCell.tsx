"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";

interface DataWithId {
  id: string;
}

export default function TextInputCell<TData extends DataWithId>({
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
    <Input
      className="border-0 shadow-none focus-visible:ring-0"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={() => {
        table.options.meta?.updateData(row.original.id, column.id, value);
      }}
      type="text"
    />
  );
}
