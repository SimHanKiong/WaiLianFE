"use client";

import { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BaseCellProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  padding?: "none" | "sm" | "md";
  verticalPadding?: "none" | "sm" | "md";
  style?: CSSProperties;
}

export default function BaseCell({
  children,
  className,
  align = "left",
  padding = "md",
  verticalPadding = "md",
  style,
}: BaseCellProps) {
  const paddingClasses = {
    none: "px-0",
    sm: "px-2",
    md: "px-3",
  };

  const verticalPaddingClasses = {
    none: "py-0",
    sm: "py-0.5",
    md: "py-1",
  };

  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={cn(
        "flex w-full h-9 items-center",
        paddingClasses[padding],
        verticalPaddingClasses[verticalPadding],
        alignClasses[align],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
