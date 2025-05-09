import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border bg-background/50 px-4 text-base",
        "transition-all duration-200 ease-in-out",
        "placeholder:text-muted-foreground/60 text-foreground",
        "border-input/20 hover:border-input/40",
        "backdrop-blur-sm",
        "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
        "aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-input/20",
        "file:border-0 file:bg-accent/10 file:text-accent file:rounded-md",
        "file:px-3 file:py-1 file:mr-3 file:hover:bg-accent/20",
        "file:transition-colors file:duration-200",
        "selection:bg-accent/20 selection:text-accent",
        className
      )}
      {...props}
    />
  )
}

export { Input }
