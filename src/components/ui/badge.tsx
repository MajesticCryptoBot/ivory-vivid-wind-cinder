// src/components/ui/badge.tsx
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "just" | "breaking" | "alert" | "new";
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
