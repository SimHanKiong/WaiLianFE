"use client";

import validator from "validator";

import { ReactNode } from "react";

import BaseCell from "./BaseCell";

interface DisplayCellProps {
  value: string | number | null | undefined;
  icon?: ReactNode;
  className?: string;
  textColour?: string;
}

export default function DisplayCell({
  value,
  icon,
  className,
  textColour,
}: DisplayCellProps) {
  return (
    <BaseCell align="left" className={className} style={{ color: textColour }}>
      {value && icon && (
        <span className="flex w-10 items-center justify-center">{icon}</span>
      )}
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
    </BaseCell>
  );
}
