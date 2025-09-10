import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none md:text-sm",
        "border-input dark:bg-input/30",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        // Focus states - more subtle approach
        "focus-visible:border-primary/50 focus-visible:shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]",
        "dark:focus-visible:border-primary/30 dark:focus-visible:shadow-[0_0_0_1px_hsl(var(--primary)/0.05)]",
        // Error states
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_1px_hsl(var(--destructive)/0.1)]",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:shadow-[0_0_0_1px_hsl(var(--destructive)/0.05)]",
        // File input styles
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
