"use client";

import { CellContext } from "@tanstack/react-table";

export default function ImageDisplayCell<TData>({
  getValue,
}: CellContext<TData, string | null | undefined>) {
  const url = getValue();

  if (!url) {
    return (
      <div className="text-m flex w-full items-center px-3 text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="flex h-16 w-full items-center px-3">
      <a href={url}>
        <img
          src={url}
          alt="Preview"
          className="max-h-16 max-w-[200px] rounded border object-contain"
        />
      </a>
    </div>
  );
}
