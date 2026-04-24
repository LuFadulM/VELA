"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  X,
  CalendarClock,
  Video,
  Users2,
  Sparkles,
  Wand2,
  FileText,
  Mail,
  Share2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceDot } from "@/components/ui/confidence";
import { cn } from "@/lib/utils";
import { mockContacts } from "@/lib/mocks";
import type { Meeting } from "@/types";

const TABS = ["Agenda", "Attendees", "Context", "Notes"] as const;
type Tab = (typeof TABS)[number];

/**
 * Full-screen meeting prep pack modal. Four tabs — agenda, attendee
 * profiles, context brief, and live notes — plus export affordances.
 * Regenerate button triggers the AI prep-pack pipeline; in mock mode it
 * just simulates a 600ms "thinking" state.
 */
export function PrepPackModal({
  meeting,
  open,
  onClose,
}: {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Agenda");
  const [regenerating, setRegenerating] = useState(false);

  async function regenerate() {
    setRegenerating(true);
    await new Promise((r) => setTimeout(r, 600));
    setRegenerating(false);
  }

  return (
    <AnimatePresence>
      {open && meeting && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-navy-900/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-label={`Prep pack for ${meeting.title}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-6 bottom-6 z-50 mx-auto flex w-[min(960px,94vw)] flex-col overflow-hidden rounded-modal border border-navy-200 bg-white shadow-lift"
          >
            {/* header */}
            <header className="border-b border-navy-100 bg-gradient-to-br from-white via-indigo-50/50 to-white px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                    <Sparkles className="h-3.5 w-3.5" /> Prep pack
                    <ConfidenceDot level={meeting.prepPackGenerated ? "high" : "medium"} />
                  </div>
                  <h2 className="mt-1 text-[20px] font-bold tracking-tight text-navy-900">{meeting.title}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-navy-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {format(meeting.startTime, "EEE, MMM d · h:mm a")} – {format(meeting.endTime, "h:mm a")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users2 className="h-3.5 w-3.5" />
                      {meeting.attendees.length} attendees
                    </span>
                    {meeting.videoLink && (
                      <a
                        href={meeting.videoLink}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700"
                      >
                        <Video className="h-3 w-3" /> Join
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={regenerate} loading={regenerating}>
                    <Wand2 className="h-3.5 w-3.5" /> Regenerate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-3.5 w-3.5" /> Export
                  </Button>
                  <button onClick={onClose} className="rounded-md p-1.5 text-navy-500 hover:bg-navy-100" aria-label="Close">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <nav className="mt-4 flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[12px] font-semibold transition",
                      tab === t ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-100",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </header>

            {/* body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {tab === "Agenda" && <AgendaTab meeting={meeting} />}
              {tab === "Attendees" && <AttendeesTab meeting={meeting} />}
              {tab === "Context" && <ContextTab meeting={meeting} />}
              {tab === "Notes" && <NotesTab meeting={meeting} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AgendaTab({ meeting }: { meeting: Meeting }) {
  const agenda =
    meeting.agenda && meeting.agenda.length > 0
      ? meeting.agenda
      : [
          { item: "Context & opening", durationMin: 5 },
          { item: "Core discussion", durationMin: 20 },
          { item: "Decisions & owners", durationMin: 5 },
        ];
  const total = agenda.reduce((n, a) => n + a.durationMin, 0);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy-900">Agenda · {total} min</h3>
        <Button size="sm" variant="ghost">
          + Add item
        </Button>
      </div>
      <ol className="space-y-2">
        {agenda.map((a, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 rounded-lg border border-navy-200 bg-white p-3 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <div className="font-medium text-navy-900">{a.item}</div>
                {a.owner && <div className="text-[11px] text-navy-500">Lead: {a.owner}</div>}
              </div>
            </div>
            <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[11px] font-semibold text-navy-700">
              {a.durationMin}m
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 text-xs">
        <div className="mb-1 flex items-center gap-1.5 font-semibold uppercase tracking-wide text-indigo-700">
          <Sparkles className="h-3 w-3" /> Vela's suggestion
        </div>
        <p className="text-navy-800">
          Time feels tight for a board-level discussion. Consider promoting "Decisions & owners" to 10 minutes; I can trim "Context" to 3.
        </p>
      </div>
    </div>
  );
}

function AttendeesTab({ meeting }: { meeting: Meeting }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {meeting.attendees.map((a) => {
        const contact = mockContacts.find((c) => c.email === a.email || c.name === a.name);
        return (
          <div key={a.email} className="rounded-lg border border-navy-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <Avatar name={a.name} size={40} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy-900">{a.name}</h4>
                  {contact && (
                    <Badge tone={contact.relationshipStrength === "STRONG" ? "emerald" : "neutral"}>
                      {contact.relationshipStrength.toLowerCase()}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-navy-500">
                  {contact ? `${contact.role} · ${contact.company}` : a.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-xs text-navy-700">
              {contact && (
                <p>
                  <b>Last touch:</b> {format(contact.lastContactDate, "MMM d")} ·{" "}
                  {contact.interactionCount} interactions total
                </p>
              )}
              <p className="rounded-md bg-indigo-50 p-2 text-indigo-900">
                <b>Conversation tip:</b>{" "}
                {contact?.notes?.split(".")[0] ??
                  "Open with a specific thank-you, then move directly to the ask. Time-efficient people appreciate it."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ContextTab({ meeting }: { meeting: Meeting }) {
  return (
    <div className="space-y-4 text-sm text-navy-800">
      <section className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
          <Sparkles className="h-3 w-3" /> Context brief
        </div>
        <p>
          This is the third conversation in this thread in two weeks. Last time, {meeting.attendees[0]?.name.split(" ")[0]} raised two open questions that you owe them an answer on — partnership scope and timeline.
          They tend to be direct and appreciate specific numbers; come with the Q3 traction slide bookmarked.
        </p>
      </section>

      <section>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Recent threads</h4>
        <ul className="space-y-2">
          {[
            { subject: "Re: Q3 board pre-read — urgent", summary: "Pre-read due Friday 5pm; Marcus's comments needed on slides 4 & 7." },
            { subject: "Reschedule request — Orion partnership", summary: "Keiko proposed JST-friendly slots next week." },
          ].map((t) => (
            <li key={t.subject} className="flex items-start gap-2 rounded-md bg-white p-3 shadow-card">
              <Mail className="mt-0.5 h-4 w-4 flex-none text-navy-400" />
              <div>
                <div className="text-[12.5px] font-semibold text-navy-900">{t.subject}</div>
                <div className="text-[11.5px] italic text-navy-500">{t.summary}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Suggested topics</h4>
        <ul className="space-y-1.5 text-[13px]">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Confirm scope of partnership MOU
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Clarify legal clauses flagged by Bluestone
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Agree on next milestone + owners
          </li>
        </ul>
      </section>

      <section>
        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">Relevant documents</h4>
        <ul className="space-y-1.5">
          {["Q3 Board Pre-Read", "Orion MSA — v3 with Bluestone markup", "Weekly Ops Briefing"].map((d) => (
            <li
              key={d}
              className="flex items-center gap-2 rounded-md border border-navy-200 bg-white p-2 text-[12.5px] text-navy-800 hover:bg-navy-50"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function NotesTab({ meeting }: { meeting: Meeting }) {
  const [notes, setNotes] = useState(meeting.notes ?? "");

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">Live notes</h4>
        <Button size="sm" variant="outline">
          <Wand2 className="h-3.5 w-3.5" /> Extract action items
        </Button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={16}
        placeholder="Start typing while the meeting is live — Vela will extract action items and draft a follow-up after the meeting ends."
        className="flex-1 resize-none rounded-lg border border-navy-200 bg-white p-3 text-[13px] leading-relaxed text-navy-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
      <p className="mt-2 text-[11px] text-navy-500">
        Notes auto-save every 10s. When the meeting ends, Vela drafts a follow-up and distributes the summary.
      </p>
    </div>
  );
}
