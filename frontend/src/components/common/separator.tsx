import { cn } from "@/utils/className";
import React from "react";

export default function Separator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-full h-[1px] bg-black opacity-20", className)}
      {...props}
    ></div>
  );
}
