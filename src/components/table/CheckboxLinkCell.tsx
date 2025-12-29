// CheckboxLinkCell.tsx
"use client";

import { useState } from "react";

import { Checkbox } from "../ui/checkbox";
import BaseCell from "./BaseCell";

interface CheckboxLinkCellProps {
  link?: string | null;
  initialValue?: boolean;
}

export default function CheckboxLinkCell({
  link,
  initialValue = false,
}: CheckboxLinkCellProps) {
  const [value, setValue] = useState(initialValue);

  const handleCheckedChange = () => {
    const newValue = !value;
    setValue(newValue);

    if (newValue && link) {
      window.open(link, "_blank", "noopener noreferrer");
    }
  };

  return (
    <BaseCell align="center">
      <Checkbox
        className="size-5 data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
        checked={value}
        onCheckedChange={handleCheckedChange}
      />
    </BaseCell>
  );
}
