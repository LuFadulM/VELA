"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  CalendarClock,
  CheckSquare,
  Users2,
  Users,
  FileText,
  Zap,
  Plug,
  Settings,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { mockWorkspace } from "@/lib/mocks";

const NAV: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
  { href: "/dashboard/inbox", label: "Inbox", icon: Inbox, badge: 5 },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarClock, badge: 3 },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare, badge: 12 },
  { href: "/dashboard/meetings", label: "Meetings", icon: Users2 },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/automations", label: "Automations", icon: Zap, badge: 3 },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onAskVela }: { onAskVela: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[236px] flex-col border-r border-navy-100 bg-white">
      {/* workspace switcher */}
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Vela home">
          <Logo />
        </Link>
      </div>

      <button className="mx-3 mb-2 flex items-center justify-between gap-2 rounded-lg border border-navy-200 bg-white px-2.5 py-2 text-left text-sm transition hover:bg-navy-50">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-navy-900 text-[10px] font-bold text-white">
            NW
          </span>
          <span className="truncate font-medium">{mockWorkspace.name}</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 flex-none text-navy-400" />
      </button>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm transition",
                    active
                      ? "bg-navy-900 text-white"
                      : "text-navy-600 hover:bg-navy-100 hover:text-navy-900",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px] font-semibold",
                        active ? "bg-indigo-500/90 text-white" : "bg-navy-100 text-navy-700",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ask vela */}
      <div className="border-t border-navy-100 p-3">
        <button
          onClick={onAskVela}
          className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-900 p-3 text-left text-white shadow-card transition hover:shadow-lift"
        >
          <div className="absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="relative flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-indigo-300">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">Ask Vela</div>
              <div className="text-[11px] text-navy-300">⌘ K to open</div>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
