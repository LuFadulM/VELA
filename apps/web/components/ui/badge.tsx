import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "indigo" | "emerald" | "amber" | "rose" | "sky" | "navy";

const tones: Record<Tone, string> = {
  neutral: "bg-navy-100 text-navy-700 border-navy-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  sky: "bg-sky-50 text-sky-700 border-sky-100",
  navy: "bg-navy-900 text-white border-navy-900",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
