import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/20 transition",
        "placeholder:text-navy-400 focus:border-indigo-500 focus:ring-4",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500/20 transition",
        "placeholder:text-navy-400 focus:border-indigo-500 focus:ring-4",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
