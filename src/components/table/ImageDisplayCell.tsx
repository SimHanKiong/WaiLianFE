"use client";

import { CellContext } from "@tanstack/react-table";

import BaseCell from "./BaseCell";

export default function ImageDisplayCell<TData>({
  getValue,
}: CellContext<TData, string | null | undefined>) {
  const url = getValue();

  if (!url) {
    return (
      <BaseCell>
        <span className="text-gray-400">No Image</span>
      </BaseCell>
    );
  }

  return (
    <BaseCell>
      <a href={url}>
        <img
          src={url}
          alt="Preview"
          className="max-h-16 max-w-full rounded border object-contain"
        />
      </a>
    </BaseCell>
  );
}
