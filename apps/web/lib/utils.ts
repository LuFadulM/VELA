import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const PALETTE = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6",
  "#EC4899", "#14B8A6", "#8B5CF6", "#F97316", "#22C55E",
];

export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length]!;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function urgencyLevel(score: number): "urgent" | "high" | "medium" | "low" | "fyi" {
  if (score >= 9) return "urgent";
  if (score >= 7) return "high";
  if (score >= 5) return "medium";
  if (score >= 3) return "low";
  return "fyi";
}

export function urgencyColor(level: ReturnType<typeof urgencyLevel>): string {
  return {
    urgent: "#EF4444",
    high: "#F97316",
    medium: "#EAB308",
    low: "#22C55E",
    fyi: "#3B82F6",
  }[level];
}
