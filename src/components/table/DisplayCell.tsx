"use client";

import { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import validator from "validator";

export default function DisplayCell<TData>({
  getValue,
}: CellContext<TData, string | number>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex w-full px-3 py-1 text-base md:text-sm">
      {value && typeof value === "string" && validator.isEmail(value) ? (
        <a href={`mailto:${value}`} className="text-blue-500 hover:underline">
          {value}
        </a>
      ) : value && typeof value === "string" && validator.isISO8601(value) ? (
        new Date(value).toLocaleDateString("en-SG", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        })
      ) : (
        value
      )}
    </div>
  );
}
