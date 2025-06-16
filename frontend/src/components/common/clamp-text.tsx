import React from "react";

interface ClampTextProps {
  text: string;
  lines: number;
  className?: string;
  showTitle?: boolean;
}

export default function ClampText({
  text,
  lines,
  className,
  showTitle = true,
}: ClampTextProps) {
  return (
    <p
      className={`line-clamp-${lines} ${className}`}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
      title={showTitle ? text : ""}
    >
      {text}
    </p>
  );
}
