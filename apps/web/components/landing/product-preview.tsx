"use client";
import { motion } from "framer-motion";
import { Inbox, Calendar, CheckCircle2, Sparkles } from "lucide-react";

/**
 * Interactive-ish dashboard preview rendered entirely in CSS.
 * No screenshots, no external assets — so the landing page
 * always reflects what the dashboard actually looks like.
 */
export function ProductPreview() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-5xl"
    >
      <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-indigo-400/10 to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-modal border border-navy-200 bg-white shadow-lift">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-navy-100 bg-navy-50 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <div className="ml-3 flex-1">
            <div className="mx-auto inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-[11px] text-navy-500 ring-1 ring-navy-200">
              vela.ai / inbox
            </div>
          </div>
        </div>

        <div className="grid h-[460px] grid-cols-[220px_1fr_320px]">
          {/* sidebar */}
          <div className="flex flex-col gap-1 border-r border-navy-100 bg-navy-50/50 p-3 text-[13px]">
            {[
              ["Inbox", 7, true],
              ["Calendar", 3, false],
              ["Tasks", 12, false],
              ["Meetings", 0, false],
              ["Contacts", 0, false],
              ["Automations", 3, false],
            ].map(([label, count, active]) => (
              <div
                key={label as string}
                className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${
                  active ? "bg-white text-navy-900 shadow-card" : "text-navy-500"
                }`}
              >
                <span className="font-medium">{label as string}</span>
                {Number(count) > 0 && (
                  <span className={`rounded-full px-1.5 text-[10px] ${active ? "bg-indigo-600 text-white" : "bg-navy-100 text-navy-600"}`}>
                    {count as number}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* thread list */}
          <div className="border-r border-navy-100 bg-white">
            <div className="border-b border-navy-100 px-4 py-3 text-[13px] font-semibold text-navy-900">
              Inbox · 7 need attention
            </div>
            {[
              { from: "Deena Park", subject: "Re: Q3 board pre-read — urgent", color: "#EF4444", summary: "Needs pre-read by Fri 5pm", unread: true },
              { from: "Keiko Tanaka", subject: "Reschedule request — Orion", color: "#F97316", summary: "3 new JST-friendly slots", unread: true },
              { from: "Priya Shah", subject: "Approve Sr PM offer", color: "#F97316", summary: "Competing offer expires Fri", unread: true },
              { from: "Jordan Meyer", subject: "AcmeCo renewal proposal", color: "#EAB308", summary: "Wants 30m walkthrough", unread: false },
            ].map((t, idx) => (
              <div
                key={idx}
                className={`flex gap-3 border-b border-navy-100 px-4 py-3 ${t.unread ? "bg-white" : "bg-navy-50/30"}`}
              >
                <div className="mt-1 h-7 w-1 rounded-full" style={{ background: t.color }} />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] font-semibold text-navy-900">{t.from}</span>
                    <span className="text-[10px] text-navy-400">2m</span>
                  </div>
                  <div className="truncate text-[12px] text-navy-700">{t.subject}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-navy-500">
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                    <span className="truncate italic">{t.summary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ai panel */}
          <div className="bg-navy-50/40 p-4 text-[12.5px]">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-navy-900 text-white">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
                Vela summary
              </span>
            </div>
            <p className="text-navy-700">
              Deena needs the Q3 board pre-read by <b>Friday 5pm ET</b>. Slides 4 (traction) and 7 (runway) need Marcus's review.
            </p>

            <div className="my-4 h-px bg-navy-200" />

            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy-500">
              Suggested actions
            </div>
            {[
              { icon: Inbox, label: "Reply — confirm Friday timeline" },
              { icon: Calendar, label: "Block Thu AM for Marcus to review" },
              { icon: CheckCircle2, label: "Create task: Finalize pre-read" },
            ].map((a, idx) => (
              <div key={idx} className="mb-1.5 flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-navy-700 ring-1 ring-navy-200">
                <a.icon className="h-3.5 w-3.5 text-indigo-600" />
                <span className="flex-1">{a.label}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            ))}

            <div className="mt-4 rounded-md border border-indigo-100 bg-indigo-50 p-3 text-[12px] text-navy-800">
              <div className="mb-1 font-semibold text-indigo-700">Draft reply</div>
              Hi Deena, thanks for the nudge — Marcus will review Thursday morning. You'll have the pre-read by Friday 3pm ET…
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
