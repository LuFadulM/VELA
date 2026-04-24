"use client";
import { useState } from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { CalendarClock, Sparkles, Video, Wand2 } from "lucide-react";
import { AvatarStack } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Meeting } from "@/types";

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8am–6pm

export function CalendarView({ meetings }: { meetings: Meeting[] }) {
  const [anchor, setAnchor] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [nlp, setNlp] = useState("");
  const days = Array.from({ length: 5 }, (_, i) => addDays(anchor, i));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      {/* NLP scheduler */}
      <div className="border-b border-navy-100 bg-gradient-to-br from-indigo-50 to-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-xl border border-navy-200 bg-white p-1.5 shadow-card">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <input
            value={nlp}
            onChange={(e) => setNlp(e.target.value)}
            placeholder="Schedule with Vela — e.g. 'Find 30m with Deena next week, mention the offsite'"
            className="flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-navy-400"
          />
          <Button variant="accent" size="sm">
            <Wand2 className="h-3.5 w-3.5" /> Find times
          </Button>
        </div>
      </div>

      {/* week nav */}
      <div className="flex items-center justify-between border-b border-navy-100 px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setAnchor(addDays(anchor, -7))}>
            ←
          </Button>
          <span className="text-sm font-semibold text-navy-900">
            {format(days[0]!, "MMM d")} – {format(days[4]!, "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="sm" onClick={() => setAnchor(addDays(anchor, 7))}>
            →
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAnchor(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
            Today
          </Button>
        </div>
        <div className="flex gap-1 text-xs">
          {["Month", "Week", "Day"].map((v, i) => (
            <button
              key={v}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium",
                i === 1 ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-100",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div className="grid grid-cols-[56px_repeat(5,minmax(0,1fr))] border-b border-navy-100">
            <div />
            {days.map((d) => (
              <div key={d.toISOString()} className="border-l border-navy-100 px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-navy-500">{format(d, "EEE")}</div>
                <div
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold",
                    isSameDay(d, new Date()) ? "bg-navy-900 text-white" : "text-navy-900",
                  )}
                >
                  {format(d, "d")}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[56px_repeat(5,minmax(0,1fr))]">
            {HOURS.map((h) => (
              <div key={h} className="contents">
                <div className="sticky left-0 h-16 border-b border-navy-100 bg-white px-2 text-right text-[10px] text-navy-400">
                  {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                </div>
                {days.map((d) => {
                  const slot = new Date(d);
                  slot.setHours(h, 0, 0, 0);
                  const meeting = meetings.find(
                    (m) => isSameDay(m.startTime, d) && m.startTime.getHours() === h,
                  );
                  return (
                    <div
                      key={d.toISOString() + h}
                      className="relative h-16 border-b border-l border-navy-100"
                    >
                      {meeting && <MeetingBlock meeting={meeting} />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* day overview */}
        <aside className="hidden w-[280px] flex-none overflow-y-auto border-l border-navy-100 bg-navy-50/40 p-4 scrollbar-thin lg:block">
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Day overview</h3>
          <p className="mb-3 text-xs text-navy-500">{format(new Date(), "EEEE, MMM d")}</p>
          <ul className="space-y-2">
            {meetings
              .filter((m) => isSameDay(m.startTime, new Date()))
              .map((m) => (
                <li key={m.id} className="rounded-md bg-white p-2.5 shadow-card">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-semibold text-navy-900">{m.title}</span>
                    {m.prepPackGenerated && <Badge tone="emerald">Prep</Badge>}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-navy-500">
                    <span>{format(m.startTime, "h:mm a")} – {format(m.endTime, "h:mm a")}</span>
                    {m.videoLink && <Video className="h-3 w-3 text-indigo-500" />}
                  </div>
                  <div className="mt-2">
                    <AvatarStack names={m.attendees.map((a) => a.name)} size={18} />
                  </div>
                </li>
              ))}
            {meetings.filter((m) => isSameDay(m.startTime, new Date())).length === 0 && (
              <li className="text-xs text-navy-500">No meetings today.</li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function MeetingBlock({ meeting }: { meeting: Meeting }) {
  const durationMin = (meeting.endTime.getTime() - meeting.startTime.getTime()) / 60_000;
  const height = Math.max(32, (durationMin / 60) * 64 - 4);
  return (
    <div
      className="absolute inset-x-1 top-1 overflow-hidden rounded-md bg-indigo-500/90 px-1.5 py-1 text-[10.5px] text-white shadow-card transition hover:bg-indigo-600"
      style={{ height }}
    >
      <div className="flex items-center gap-1">
        <CalendarClock className="h-3 w-3 flex-none" />
        <span className="truncate font-semibold">{meeting.title}</span>
      </div>
      <div className="truncate text-indigo-100">
        {format(meeting.startTime, "h:mm a")} · {meeting.attendees.length}
      </div>
    </div>
  );
}
