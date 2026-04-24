import { cn } from "@/lib/utils";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-label="Vela logo"
      >
        <rect width="32" height="32" rx="8" fill="#0F172A" />
        <path
          d="M8 10 L16 24 L24 10"
          stroke="#6366F1"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="10" r="1.75" fill="#6366F1" />
      </svg>
      <span className="text-[15px] font-bold tracking-tight">Vela</span>
    </span>
  );
}
