import * as React from "react";
import { cn, initials, avatarColor } from "@/lib/utils";

export function Avatar({
  name,
  size = 32,
  className,
  src,
}: {
  name: string;
  size?: number;
  className?: string;
  src?: string | null;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-[11px] font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: avatarColor(name),
        fontSize: Math.max(10, size * 0.38),
      }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({
  names,
  max = 4,
  size = 24,
}: {
  names: string[];
  max?: number;
  size?: number;
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} className="ring-2 ring-white" />
      ))}
      {extra > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-navy-100 text-[10px] font-semibold text-navy-700 ring-2 ring-white"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
