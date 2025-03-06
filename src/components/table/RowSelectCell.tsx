"use client";

import { CellContext } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

interface DataWithId {
  id: string;
}

export default function RowSelectCell<TData extends DataWithId>({
  row,
}: CellContext<TData, unknown>) {
  return (
    <div className="flex justify-center">
      <Checkbox
        className="h-6 w-6 items-center data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    </div>
  );
}
