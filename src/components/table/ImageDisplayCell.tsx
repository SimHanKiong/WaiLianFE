"use client";

import { CellContext } from "@tanstack/react-table";

export default function ImageDisplayCell<TData>({
  getValue,
}: CellContext<TData, string | null | undefined>) {
  const url = getValue();

  if (!url) {
    return (
      <div className="flex items-center justify-center w-full text-m text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-16">
      <a href={url}>
        <img
          src={url}
          alt="Preview"
          className="max-h-16 max-w-[200px] object-contain rounded border"
        />
      </a>
    </div>
  );
}
