import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-navy-200 bg-navy-50/50 p-10 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-card">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-navy-900">{title}</h4>
      {description && <p className="max-w-sm text-xs text-navy-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
