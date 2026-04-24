"use client";
import { useMemo, useState } from "react";
import {
  Archive,
  CheckSquare,
  Filter,
  Mail,
  Reply,
  Sparkles,
  Star,
  CalendarClock,
  Wand2,
  ChevronRight,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceDot } from "@/components/ui/confidence";
import { formatRelativeTime, urgencyLevel, urgencyColor, cn } from "@/lib/utils";
import type { EmailThread, Tone } from "@/types";

const FILTERS = ["All", "Urgent", "Needs Response", "FYI", "Waiting"] as const;
type FilterKey = (typeof FILTERS)[number];

const TONES: Tone[] = ["Professional", "Friendly", "Direct", "Brief"];

export function InboxView({ threads }: { threads: EmailThread[] }) {
  const [activeId, setActiveId] = useState<string>(threads[0]?.id ?? "");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [tone, setTone] = useState<Tone>("Professional");

  const filtered = useMemo(() => {
    const base = [...threads].sort((a, b) => b.urgencyScore - a.urgencyScore);
    switch (filter) {
      case "Urgent":
        return base.filter((t) => t.urgencyScore >= 8);
      case "Needs Response":
        return base.filter((t) => t.requiredAction === "reply" || t.requiredAction === "schedule");
      case "FYI":
        return base.filter((t) => t.requiredAction === "fyi");
      case "Waiting":
        return base.filter((t) => t.tags.includes("waiting") || t.requiredAction === "delegate");
      default:
        return base;
    }
  }, [threads, filter]);

  const active = threads.find((t) => t.id === activeId) ?? filtered[0];

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden">
      {/* thread list */}
      <div className="flex w-[380px] flex-none flex-col border-r border-navy-100 bg-white">
        <div className="flex items-center gap-2 border-b border-navy-100 px-3 py-2">
          <Filter className="h-3.5 w-3.5 text-navy-500" />
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                  filter === f
                    ? "bg-navy-900 text-white"
                    : "text-navy-600 hover:bg-navy-100",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.length === 0 && (
            <li className="p-6 text-center text-xs text-navy-500">No threads match this filter.</li>
          )}
          {filtered.map((t) => {
            const selected = active?.id === t.id;
            const level = urgencyLevel(t.urgencyScore);
            return (
              <li key={t.id}>
                <button
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "flex w-full gap-3 border-b border-navy-100 px-3 py-3 text-left transition",
                    selected ? "bg-indigo-50" : "bg-white hover:bg-navy-50",
                  )}
                >
                  <div
                    className="mt-1 h-8 w-1 flex-none rounded-full"
                    style={{ background: urgencyColor(level) }}
                    aria-label={`${level} urgency`}
                  />
                  <Avatar name={t.participants[0]?.name ?? "?"} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-[12.5px]", !t.isRead ? "font-semibold text-navy-900" : "text-navy-700")}>
                        {t.participants[0]?.name}
                      </span>
                      <span className="flex-none text-[10px] text-navy-400">
                        {formatRelativeTime(t.lastMessageAt)}
                      </span>
                    </div>
                    <div className={cn("truncate text-[12.5px]", !t.isRead ? "font-semibold text-navy-900" : "text-navy-600")}>
                      {t.subject}
                    </div>
                    <div className="mt-0.5 line-clamp-1 flex items-start gap-1 text-[11px] text-navy-500">
                      <Sparkles className="mt-0.5 h-3 w-3 flex-none text-indigo-500" />
                      <span className="italic">{t.aiSummary}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {t.requiredAction === "reply" && <Badge tone="rose">Reply needed</Badge>}
                      {t.requiredAction === "schedule" && <Badge tone="indigo">Schedule</Badge>}
                      {t.requiredAction === "fyi" && <Badge tone="sky">FYI</Badge>}
                      {t.requiredAction === "delegate" && <Badge tone="amber">Waiting</Badge>}
                      {t.isStarred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* thread view */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-navy-100 bg-white">
        {active ? (
          <>
            <div className="border-b border-navy-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[15px] font-semibold tracking-tight text-navy-900">
                  {active.subject}
                </h2>
                <Badge tone={urgencyLevel(active.urgencyScore) === "urgent" ? "rose" : "neutral"}>
                  urgency {active.urgencyScore}/10
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-navy-500">
                <Avatar name={active.participants[0]?.name ?? "?"} size={20} />
                <span className="font-medium text-navy-800">{active.participants[0]?.name}</span>
                <span>·</span>
                <span>{active.participants[0]?.email}</span>
                <span>·</span>
                <span>{active.messageCount} messages</span>
              </div>
            </div>

            {/* AI brief */}
            <div className="border-b border-navy-100 bg-indigo-50/70 px-6 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Vela's brief
                <ConfidenceDot level="high" />
              </div>
              <p className="mt-1 text-sm text-navy-800">{active.aiSummary}</p>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-navy-800">
                {active.body}
              </div>
            </div>

            {/* bulk actions */}
            <div className="flex items-center gap-2 border-t border-navy-100 px-6 py-3">
              <Button variant="primary" size="sm">
                <Reply className="h-3.5 w-3.5" /> Reply
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="h-3.5 w-3.5" /> Archive
              </Button>
              <Button variant="outline" size="sm">
                <CheckSquare className="h-3.5 w-3.5" /> Create task
              </Button>
              <Button variant="outline" size="sm">
                <CalendarClock className="h-3.5 w-3.5" /> Schedule
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-navy-500">
            Select a thread to open it.
          </div>
        )}
      </div>

      {/* AI assistant panel */}
      {active && (
        <div className="hidden w-[340px] flex-none flex-col overflow-y-auto bg-navy-50/40 scrollbar-thin lg:flex">
          <div className="border-b border-navy-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Vela
            </div>
            <p className="mt-1 text-xs text-navy-600">Summary, actions, and a draft — ready for review.</p>
          </div>

          {/* suggested actions */}
          <section className="border-b border-navy-100 p-4">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Suggested actions</h4>
            <ul className="space-y-1.5">
              {active.aiActionItems.length === 0 ? (
                <li className="text-xs text-navy-500">No clear action required.</li>
              ) : (
                active.aiActionItems.map((a, i) => (
                  <li key={i} className="group flex items-center justify-between gap-2 rounded-md bg-white p-2 text-xs shadow-card">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                        <Wand2 className="h-3 w-3" />
                      </span>
                      <span className="text-navy-800">{a.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ConfidenceDot level={a.confidence} />
                      <ChevronRight className="h-3.5 w-3.5 text-navy-400 opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* draft reply */}
          <section className="border-b border-navy-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">Draft reply</h4>
              <div className="flex gap-1">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium transition",
                      tone === t ? "bg-navy-900 text-white" : "bg-white text-navy-500 hover:bg-navy-100",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={active.draftReply ?? ""}
              readOnly
              rows={10}
              className="w-full resize-none rounded-lg border border-navy-200 bg-white p-2.5 text-[12px] leading-relaxed text-navy-800 scrollbar-thin"
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="accent" className="flex-1">
                <Mail className="h-3.5 w-3.5" /> Send
              </Button>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          </section>

          {/* related */}
          <section className="p-4">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Related</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="rounded-md bg-white p-2.5 shadow-card">
                <div className="font-semibold text-navy-900">Task · Finalize Q3 board pre-read</div>
                <div className="text-navy-500">Due Fri · In progress</div>
              </li>
              <li className="rounded-md bg-white p-2.5 shadow-card">
                <div className="font-semibold text-navy-900">Meeting · Board pre-read review</div>
                <div className="text-navy-500">Tomorrow 10:00 AM</div>
              </li>
              <li className="rounded-md bg-white p-2.5 shadow-card">
                <div className="font-semibold text-navy-900">Contact · Deena Park (VIP)</div>
                <div className="text-navy-500">Last contact 1 day ago · Strong</div>
              </li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
