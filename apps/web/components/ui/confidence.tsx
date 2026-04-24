import { cn } from "@/lib/utils";

export type Confidence = "high" | "medium" | "low";

/**
 * Tiny confidence indicator that appears next to every AI-generated suggestion
 * so the operator can calibrate trust at a glance.
 */
export function ConfidenceDot({
  level,
  className,
  withLabel,
}: {
  level: Confidence;
  className?: string;
  withLabel?: boolean;
}) {
  const color =
    level === "high" ? "bg-emerald-500" : level === "medium" ? "bg-amber-500" : "bg-rose-500";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[10px] text-navy-500", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", color)} />
      {withLabel && (
        <span className="uppercase tracking-wide">
          {level} confidence
        </span>
      )}
    </span>
  );
}
