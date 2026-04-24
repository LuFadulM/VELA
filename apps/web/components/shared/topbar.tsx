"use client";
import { Bell, Search, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { mockNotifications, mockUser, mockProfile } from "@/lib/mocks";

export function TopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const unread = mockNotifications.filter((n) => !n.isRead).length;
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-navy-100 bg-white/90 px-6 backdrop-blur">
      <div className="flex-1">
        <h1 className="text-[15px] font-semibold tracking-tight text-navy-900">{title}</h1>
        {subtitle && <p className="text-[11px] text-navy-500">{subtitle}</p>}
      </div>

      <div className="hidden items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs text-navy-500 md:flex">
        <Search className="h-3.5 w-3.5" />
        <span>Search or ask…</span>
        <kbd className="ml-3 rounded border border-navy-200 bg-navy-50 px-1.5 py-0.5 text-[10px] text-navy-500">⌘ K</kbd>
      </div>

      {actions}

      <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-navy-600 hover:bg-navy-100" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <div className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-2 py-1">
        <Avatar name={mockUser.name} src={mockUser.avatar ?? undefined} size={24} />
        <div className="hidden text-[11.5px] leading-tight md:block">
          <div className="font-semibold text-navy-900">{mockUser.name}</div>
          <div className="flex items-center gap-1 text-navy-500">
            <Sparkles className="h-2.5 w-2.5 text-indigo-500" />
            {mockProfile.role.replace("_", " ")}
          </div>
        </div>
      </div>
    </header>
  );
}
