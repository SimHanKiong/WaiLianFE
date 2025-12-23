"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";
import { DataWithId } from "./EditableTable";
import { cn } from "@/lib/utils";

interface TextInputCellProps<TData> extends CellContext<TData, string> {
  textColour?: string;
}

export default function TextInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
  textColour = "",
}: TextInputCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      className={cn("border-0 shadow-none focus-visible:ring-0", textColour)}
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
