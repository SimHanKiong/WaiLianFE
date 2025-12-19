"use client";

import { LucideIcon } from "lucide-react";

type IconColor = "orange" | "blue" | "none";

const iconColorMap = {
  orange: "fill-orange-500 text-orange-500",
  blue: "fill-blue-500 text-blue-500",
  none: "",
};

interface IconHeaderProps {
  icon: LucideIcon;
  label: string;
  color?: IconColor;
}

export default function IconHeader({
  icon: Icon,
  label,
  color = "none",
}: IconHeaderProps) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex size-10 items-center justify-center">
        <Icon className={`size-8 ${iconColorMap[color]}`} />
      </span>
      {label}
    </span>
  );
}
