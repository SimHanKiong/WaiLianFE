"use client";

import { CellContext } from "@tanstack/react-table";

import { useEffect, useState } from "react";

import { Input } from "../ui/input";
import BaseCell from "./BaseCell";
import { DataWithId } from "./EditableTable";

export default function NumberInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, number>) {
  const initialValue = getValue();
  const [value, setValue] = useState(String(initialValue));

  useEffect(() => {
    setValue(String(initialValue));
  }, [initialValue]);

  return (
    <BaseCell padding="none">
      <Input
        className="w-full border-0 shadow-none focus-visible:ring-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          const cleaned = value === "" ? "0" : String(Number(value));
          setValue(cleaned);
          table.options.meta?.updateData(
            row.original.id,
            column.id,
            Number(cleaned)
          );
        }}
        type="number"
      />
    </BaseCell>
  );
}
