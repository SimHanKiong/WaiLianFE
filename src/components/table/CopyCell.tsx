"use client";

import { CheckIcon, CopyIcon } from "lucide-react";

import { useState } from "react";

import BaseCell from "./BaseCell";

interface ClipboardCellProps {
  content: string;
}

export default function ClipboardCell({ content }: ClipboardCellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <BaseCell align="center">
      {copied ? (
        <CheckIcon className="size-6 stroke-1 text-green-500" />
      ) : (
        <CopyIcon
          className="size-6 cursor-pointer stroke-1 text-emerald-600"
          onClick={handleCopy}
        />
      )}
    </BaseCell>
  );
}
