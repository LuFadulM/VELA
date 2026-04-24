"use client";
import { format } from "date-fns";
import { Bell, CalendarClock, CheckSquare, Inbox } from "lucide-react";
import { mockMeetings, mockTasks, mockEmailThreads, mockNotifications } from "@/lib/mocks";

/**
 * Persistent right-hand "what needs me?" panel. Always visible on dashboard
 * pages so Sarah never loses sight of the day's top signals.
 */
export function ContextPanel() {
  const now = new Date();
  const upcoming = mockMeetings
    .filter((m) => m.startTime >= now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 3);
  const urgentEmails = mockEmailThreads
    .filter((e) => e.urgencyScore >= 8 && !e.isRead)
    .slice(0, 3);
  const overdue = mockTasks
    .filter((t) => t.status !== "DONE" && t.status !== "CANCELLED" && t.dueDate <= now)
    .slice(0, 3);
  const unreadNotif = mockNotifications.filter((n) => !n.isRead).slice(0, 3);

  return (
    <aside className="hidden h-screen w-[320px] flex-none overflow-y-auto border-l border-navy-100 bg-navy-50/40 p-4 scrollbar-thin xl:block">
      <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-navy-500">
        Today at a glance
      </h2>
      <p className="mb-5 text-[11px] text-navy-500">
        {format(now, "EEEE, MMM d · h:mm a")}
      </p>

      {/* quick stats */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          { label: "Meetings", value: upcoming.length, icon: CalendarClock },
          { label: "Urgent", value: urgentEmails.length, icon: Inbox },
          { label: "Overdue", value: overdue.length, icon: CheckSquare },
        ].map((s) => (
          <div key={s.label} className="rounded-card bg-white p-3 text-center shadow-card">
            <s.icon className="mx-auto mb-1 h-3.5 w-3.5 text-indigo-600" />
            <div className="text-lg font-bold text-navy-900">{s.value}</div>
            <div className="text-[10px] uppercase tracking-wide text-navy-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* next meetings */}
      <Section title="Next meetings" icon={<CalendarClock className="h-3.5 w-3.5" />}>
        {upcoming.length === 0 ? (
          <p className="text-xs text-navy-500">Clear sailing for the rest of the day.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((m) => (
              <li key={m.id} className="rounded-md bg-white p-2.5 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-semibold text-navy-900">{m.title}</span>
                  <span className="text-[10px] text-navy-500">{format(m.startTime, "EEE, h:mm a")}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-navy-500">
                  <span>{m.attendees.map((a) => a.name.split(" ")[0]).join(", ")}</span>
                  {m.prepPackGenerated ? (
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                      Prep ready
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                      No prep
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* urgent emails */}
      <Section title="Urgent inbox" icon={<Inbox className="h-3.5 w-3.5" />}>
        {urgentEmails.length === 0 ? (
          <p className="text-xs text-navy-500">Nothing urgent. Nice.</p>
        ) : (
          <ul className="space-y-2">
            {urgentEmails.map((e) => (
              <li key={e.id} className="rounded-md bg-white p-2.5 shadow-card">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="truncate text-[12.5px] font-semibold text-navy-900">{e.participants[0]?.name}</span>
                </div>
                <div className="truncate text-[11px] text-navy-600">{e.subject}</div>
                <p className="mt-1 line-clamp-2 text-[10.5px] italic text-navy-500">{e.aiSummary}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* overdue tasks */}
      <Section title="Overdue" icon={<CheckSquare className="h-3.5 w-3.5" />}>
        {overdue.length === 0 ? (
          <p className="text-xs text-navy-500">All caught up.</p>
        ) : (
          <ul className="space-y-2">
            {overdue.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-md bg-white p-2.5 shadow-card">
                <span className="truncate text-[12.5px] text-navy-900">{t.title}</span>
                <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700">
                  {t.priority.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* notifications */}
      <Section title="Notifications" icon={<Bell className="h-3.5 w-3.5" />}>
        {unreadNotif.length === 0 ? (
          <p className="text-xs text-navy-500">You're current.</p>
        ) : (
          <ul className="space-y-2">
            {unreadNotif.map((n) => (
              <li key={n.id} className="rounded-md bg-white p-2.5 shadow-card">
                <div className="text-[12.5px] font-semibold text-navy-900">{n.title}</div>
                <div className="text-[11px] text-navy-600">{n.body}</div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </aside>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-500">
        <span className="text-indigo-600">{icon}</span>
        {title}
      </div>
      {children}
    </section>
  );
}
