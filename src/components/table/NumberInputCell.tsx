"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";

interface DataWithId {
  id: string;
}

interface NumberInputCellProps<TData> extends CellContext<TData, number> {
  updateCellAction: (id: string, dataUpdate: Partial<TData>) => Promise<void>;
}

export default function NumberInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  // table,
  updateCellAction,
}: NumberInputCellProps<TData>) {
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
        // table.options.meta?.updateData(row.index, column.id, value);
        updateCellAction(row.original.id, {
          [column.id]: value,
        } as Partial<TData>);
      }}
      type="number"
    />
  );
}
