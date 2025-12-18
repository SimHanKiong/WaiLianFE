"use client";

import validator from "validator";

interface DisplayCellProps {
  value: string | number | null | undefined;
}

export default function DisplayCell({ value }: DisplayCellProps) {
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
