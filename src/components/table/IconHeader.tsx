"use client";

import { ReactNode } from "react";

interface IconHeaderProps {
  icon: ReactNode;
  label: string;
}

export default function IconHeader({ icon, label }: IconHeaderProps) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex size-10 items-center justify-center">{icon}</span>
      {label}
    </span>
  );
}
