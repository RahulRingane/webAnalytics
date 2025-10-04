"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  withOr?: boolean;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  withOr = false,
  ...props
}: SeparatorProps) {
  return (
    <div className="relative flex w-full items-center">
      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className,
        )}
        {...props}
      />
      {withOr && (
        <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-sm text-gray-400">
          or
        </span>
      )}
    </div>
  );
}

export { Separator };
