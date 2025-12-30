"use client";

import { CellContext } from "@tanstack/react-table";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";
import BaseCell from "./BaseCell";
import { DataWithId } from "./EditableTable";

interface TextInputCellProps<TData> extends CellContext<TData, string> {
  type?: "text" | "time";
  className?: string;
}

export default function TextInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
  type = "text",
  className = "",
}: TextInputCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <BaseCell padding="none">
      <Input
        className={cn(
          "w-full border-0 shadow-none focus-visible:ring-0",
          className
        )}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={() => {
          table.options.meta?.updateData(row.original.id, column.id, value);
        }}
        type={type}
        step={type === "time" ? "1" : undefined}
      />
    </BaseCell>
  );
}
