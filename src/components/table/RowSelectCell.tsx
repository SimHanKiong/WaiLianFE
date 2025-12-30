"use client";

import { CellContext } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Checkbox } from "../ui/checkbox";
import BaseCell from "./BaseCell";

interface RowSelectCellProps<TData> extends CellContext<TData, unknown> {
  className?: string;
}

export default function RowSelectCell<TData>({
  row,
  className,
}: RowSelectCellProps<TData>) {
  return (
    <BaseCell align="center">
      <Checkbox
        className={cn(
          className,
          "size-5 items-center data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
        )}
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    </BaseCell>
  );
}
