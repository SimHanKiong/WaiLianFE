"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";
import validator from "validator";
import { useToast } from "@/hooks/use-toast";

interface DataWithId {
  id: string;
}

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
    <Input
      className="focus-visible:ring-0 border-0 shadow-none"
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      type="email"
    />
  );
}
