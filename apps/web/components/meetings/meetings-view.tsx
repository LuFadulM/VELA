"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Sparkles, Video, FileText, Check, ArrowRight, Clock } from "lucide-react";
import { AvatarStack } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceDot } from "@/components/ui/confidence";
import { PrepPackModal } from "@/components/meetings/prep-pack-modal";
import { cn } from "@/lib/utils";
import type { Meeting } from "@/types";

export function MeetingsView({ meetings }: { meetings: Meeting[] }) {
  const now = new Date();
  const upcoming = meetings.filter((m) => m.startTime >= now).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const past = meetings.filter((m) => m.startTime < now).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  const [activeId, setActiveId] = useState<string>(upcoming[0]?.id ?? meetings[0]?.id ?? "");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [prepOpenFor, setPrepOpenFor] = useState<string | null>(null);
  const active = meetings.find((m) => m.id === activeId);
  const prepMeeting = meetings.find((m) => m.id === prepOpenFor) ?? null;

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <>
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-white">
      <div className="flex w-[380px] flex-none flex-col border-r border-navy-100">
        <div className="flex items-center gap-1 border-b border-navy-100 px-3 py-2">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-semibold capitalize",
                tab === t ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-100",
              )}
            >
              {t} ({t === "upcoming" ? upcoming.length : past.length})
            </button>
          ))}
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-thin">
          {list.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => setActiveId(m.id)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b border-navy-100 px-4 py-3 text-left transition",
                  activeId === m.id ? "bg-indigo-50" : "hover:bg-navy-50",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="truncate text-[12.5px] font-semibold text-navy-900">{m.title}</span>
                  <span className="text-[10px] text-navy-400">{format(m.startTime, "EEE, MMM d")}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-navy-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(m.startTime, "h:mm a")}
                  </span>
                  {m.prepPackGenerated ? (
                    <Badge tone="emerald">Prep ready</Badge>
                  ) : (
                    <Badge tone="amber">No prep</Badge>
                  )}
                </div>
                <AvatarStack names={m.attendees.map((a) => a.name)} max={4} size={18} />
              </button>
            </li>
          ))}
          {list.length === 0 && (
            <li className="p-6 text-center text-xs text-navy-500">No meetings to show.</li>
          )}
        </ul>
      </div>

      {/* detail */}
      {active ? (
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto scrollbar-thin">
          <div className="border-b border-navy-100 px-6 py-4">
            <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">{active.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-navy-500">
              <span>{format(active.startTime, "EEEE, MMM d · h:mm a")} – {format(active.endTime, "h:mm a")} {active.timezone}</span>
              {active.videoLink && (
                <a href={active.videoLink} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                  <Video className="h-3 w-3" /> Join
                </a>
              )}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <AvatarStack names={active.attendees.map((a) => a.name)} size={22} max={8} />
              <span className="text-xs text-navy-500">{active.attendees.length} attendees</span>
            </div>
          </div>

          {/* prep pack */}
          <section className="border-b border-navy-100 bg-indigo-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Prep pack
                <ConfidenceDot level={active.prepPackGenerated ? "high" : "medium"} />
              </div>
              <Button size="sm" variant={active.prepPackGenerated ? "outline" : "accent"} onClick={() => setPrepOpenFor(active.id)}>
                {active.prepPackGenerated ? "Open prep pack" : "Generate prep pack"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {active.agenda && active.agenda.length > 0 && (
              <div className="mt-3 rounded-lg border border-indigo-100 bg-white p-3">
                <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Agenda</h4>
                <ol className="space-y-1 text-[12.5px] text-navy-800">
                  {active.agenda.map((a, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span>
                        <span className="mr-1.5 text-navy-400">{i + 1}.</span>
                        {a.item}
                        {a.owner && <span className="ml-2 text-navy-500">— {a.owner}</span>}
                      </span>
                      <span className="text-xs text-navy-400">{a.durationMin}m</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          {/* notes */}
          <section className="border-b border-navy-100 px-6 py-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">Live notes</h4>
              <Button size="sm" variant="outline">
                <FileText className="h-3.5 w-3.5" /> Open in docs
              </Button>
            </div>
            <textarea
              rows={5}
              placeholder="Start typing during the meeting — Vela will extract action items automatically."
              className="w-full rounded-lg border border-navy-200 bg-white p-3 text-[13px] text-navy-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </section>

          {/* post-meeting */}
          <section className="px-6 py-4">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">After the meeting</h4>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                { label: "Extract action items", icon: Check },
                { label: "Draft follow-up email", icon: FileText },
                { label: "Distribute notes", icon: Sparkles },
              ].map((b) => (
                <button
                  key={b.label}
                  className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white p-3 text-left text-[12.5px] font-medium text-navy-800 hover:bg-navy-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                    <b.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="flex-1">{b.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-navy-400" />
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-navy-500">
          Pick a meeting to see details.
        </div>
      )}
    </div>
    <PrepPackModal
      meeting={prepMeeting}
      open={prepOpenFor !== null}
      onClose={() => setPrepOpenFor(null)}
    />
    </>
  );
}
