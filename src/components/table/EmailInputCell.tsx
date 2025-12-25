"use client";

import { CellContext } from "@tanstack/react-table";
import validator from "validator";

import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { Input } from "../ui/input";
import BaseCell from "./BaseCell";
import { DataWithId } from "./EditableTable";

export default function EmailInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, string | null>) {
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

    table.options.meta?.updateData(row.original.id, column.id, value);
  };

  return (
    <BaseCell padding="none">
      <Input
        className="w-full border-0 shadow-none focus-visible:ring-0"
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        type="email"
      />
    </BaseCell>
  );
}
