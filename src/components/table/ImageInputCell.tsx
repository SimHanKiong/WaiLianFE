"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";
import { uploadFile } from "@/lib/services/file";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

interface DataWithId {
  id: string;
}

export default function FileInputCell<TData extends DataWithId>({
  getValue,
  row,
  column,
  table,
}: CellContext<TData, string | null>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { key } = await uploadFile(formData);
      table.options.meta?.updateData(row.original.id, column.id, key);
      setValue(key);
      toast({
        variant: "success",
        title: "Upload Successful",
        description: "File uploaded successfully.",
      });
    } catch (error) {
      console.error("File upload failed:", error);
      toast({
        variant: "destructive",
        title: "Invalid Upload",
        description: "Please upload the file again.",
      });
    }
  };

  return (
    <div className="ml-2 flex items-center gap-3">
      <Button
        type="button"
        variant={value ? "secondary" : "outline"}
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="min-w-[110px]"
      >
        {value ? "Replace File" : "Upload File"}
      </Button>
      <span className={value ? "text-m text-green-600" : "text-m text-red-600"}>
        {value ? "File Uploaded" : "No File"}
      </span>
      <Input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
