"use client";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarClock, Mail, MessageSquare, Sparkles, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Contact, RelationshipStrength } from "@/types";

const STRENGTH_COLOR: Record<RelationshipStrength, string> = {
  STRONG: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  WEAK: "bg-navy-300",
  UNKNOWN: "bg-navy-200",
};

export function ContactsView({ contacts }: { contacts: Contact[] }) {
  const [activeId, setActiveId] = useState<string>(contacts[0]?.id ?? "");
  const active = contacts.find((c) => c.id === activeId);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-white">
      <div className="flex w-[320px] flex-none flex-col border-r border-navy-100">
        <div className="border-b border-navy-100 px-3 py-2">
          <input
            placeholder="Search contacts…"
            className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-thin">
          {contacts.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-navy-100 px-3 py-2.5 text-left transition",
                  activeId === c.id ? "bg-indigo-50" : "hover:bg-navy-50",
                )}
              >
                <Avatar name={c.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[12.5px] font-semibold text-navy-900">{c.name}</span>
                    {c.tags.includes("vip") && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                  </div>
                  <div className="truncate text-[11px] text-navy-500">
                    {c.role} · {c.company}
                  </div>
                </div>
                <span
                  className={cn("h-2 w-2 flex-none rounded-full", STRENGTH_COLOR[c.relationshipStrength])}
                  aria-label={`Relationship strength: ${c.relationshipStrength}`}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* detail */}
      {active ? (
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="mb-6 flex items-start gap-4">
            <Avatar name={active.name} size={64} />
            <div className="flex-1">
              <h2 className="text-[20px] font-bold tracking-tight text-navy-900">{active.name}</h2>
              <p className="text-sm text-navy-600">
                {active.role} · {active.company}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <Badge tone={active.relationshipStrength === "STRONG" ? "emerald" : active.relationshipStrength === "MEDIUM" ? "amber" : "neutral"}>
                  {active.relationshipStrength.toLowerCase()} relationship
                </Badge>
                <span className="text-navy-500">
                  Last contact {format(active.lastContactDate, "MMM d")} · {active.interactionCount} interactions
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="accent">
                <Mail className="h-3.5 w-3.5" /> Email
              </Button>
              <Button size="sm" variant="outline">
                <CalendarClock className="h-3.5 w-3.5" /> Schedule
              </Button>
            </div>
          </div>

          {/* AI brief */}
          <div className="mb-6 rounded-card border border-indigo-100 bg-indigo-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" /> Vela's brief
            </div>
            <p className="text-sm text-navy-800">
              {active.notes ??
                `${active.name.split(" ")[0]} has a ${active.relationshipStrength.toLowerCase()} working relationship with Marcus. Most recent contact was ${format(active.lastContactDate, "MMMM d")}.`}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-navy-700">
              <li>
                <b>Communication tip:</b> Lead with the ask, context second. Prefers email for everything that isn't urgent.
              </li>
              <li>
                <b>Upcoming:</b> No meetings scheduled this week.
              </li>
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-card border border-navy-200 bg-white p-4">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Recent interactions</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-3.5 w-3.5 text-navy-400" />
                  <div>
                    <div className="text-navy-800">Re: Q3 board pre-read — urgent</div>
                    <div className="text-navy-500">25 minutes ago</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CalendarClock className="mt-0.5 h-3.5 w-3.5 text-navy-400" />
                  <div>
                    <div className="text-navy-800">Board pre-read review</div>
                    <div className="text-navy-500">Tomorrow 10:00 AM</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 text-navy-400" />
                  <div>
                    <div className="text-navy-800">Slack — offsite agenda discussion</div>
                    <div className="text-navy-500">2 days ago</div>
                  </div>
                </li>
              </ul>
            </section>

            <section className="rounded-card border border-navy-200 bg-white p-4">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {active.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="mt-5">
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Contact</h4>
                <div className="text-sm text-navy-700">{active.email}</div>
                {active.phone && <div className="text-sm text-navy-500">{active.phone}</div>}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-navy-500">
          Pick a contact.
        </div>
      )}
    </div>
  );
}
