"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";
import validator from "validator";
import { useToast } from "@/hooks/use-toast";

interface DataWithId {
  id: string;
}

interface EmailInputCellProps<TData> extends CellContext<TData, string | null> {
  updateCellAction: (id: string, dataUpdate: Partial<TData>) => Promise<void>;
}

export default function EmailInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  // table,
  updateCellAction,
}: EmailInputCellProps<TData>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const { toast } = useToast();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    if (value && !validator.isEmail(value)) {
      setValue(initialValue);
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Format of email was invalid. Please enter a valid email.",
      });
      return;
    }

    // table.options.meta?.updateData(row.index, column.id, value);

    updateCellAction(row.original.id, {
      [column.id]: value === "" ? null : value,
    } as Partial<TData>);
  };

  return (
    <Input
      className="focus-visible:ring-0 border-0 shadow-none"
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      type="email"
    />
  );
}
