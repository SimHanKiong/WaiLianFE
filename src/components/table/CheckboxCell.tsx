"use client";

import { CellContext } from "@tanstack/react-table";

import { useEffect, useState } from "react";

import { Checkbox } from "../ui/checkbox";
import BaseCell from "./BaseCell";
import { DataWithId } from "./EditableTable";

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
    <BaseCell align="center">
      <Checkbox
        className="size-5 data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
        checked={value}
        onCheckedChange={handleCheckedChange}
      />
    </BaseCell>
  );
}
