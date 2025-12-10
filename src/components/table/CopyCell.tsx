"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";

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
    <div className="flex justify-center">
      <Button onClick={handleCopy} variant="secondary" className="items-center">
        {copied ? (
          <CheckIcon className="h-5 w-5 text-green-500" />
        ) : (
          <CopyIcon className="h-5 w-5 text-gray-700" />
        )}
      </Button>
    </div>
  );
}
