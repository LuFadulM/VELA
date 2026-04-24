"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Zap, Plus, Play, CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Automation } from "@/types";

const PLAYBOOK_TEMPLATES = [
  { name: "New Meeting Booked", blurb: "Prep pack + reminder + notes + follow-up" },
  { name: "VIP Email Received", blurb: "Urgency flag + draft reply + task if actionable" },
  { name: "Weekly Ops Briefing", blurb: "Mondays 8am — briefing doc to principal" },
  { name: "Expense Approval Flow", blurb: "Extract + approval task + 48h nudge" },
];

export function AutomationsView({ automations: initial }: { automations: Automation[] }) {
  const [automations, setAutomations] = useState(initial);
  const [builder, setBuilder] = useState(false);

  function toggle(id: string) {
    setAutomations((list) =>
      list.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)),
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-navy-50/40 p-6 scrollbar-thin">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">Your automations</h2>
            <p className="text-xs text-navy-500">Playbooks that run in the background so you don't have to.</p>
          </div>
          <Button onClick={() => setBuilder((b) => !b)}>
            <Plus className="h-3.5 w-3.5" /> New automation
          </Button>
        </div>

        {/* live automations */}
        <div className="grid gap-3">
          {automations.map((a) => (
            <div key={a.id} className="flex items-start gap-4 rounded-card border border-navy-200 bg-white p-4 shadow-card">
              <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-lg", a.isActive ? "bg-indigo-50 text-indigo-600" : "bg-navy-100 text-navy-500")}>
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-navy-900">{a.name}</h3>
                  <Badge tone={a.isActive ? "emerald" : "neutral"}>{a.isActive ? "Active" : "Paused"}</Badge>
                  {a.errorCount > 0 && <Badge tone="rose">errors {a.errorCount}</Badge>}
                </div>
                <p className="mt-1 text-[12.5px] text-navy-600">{a.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-navy-500">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                    Trigger: <b className="text-navy-700">{a.triggerLabel}</b>
                  </span>
                  <span>·</span>
                  <span>{a.runCount} runs</span>
                  {a.lastRunAt && (
                    <>
                      <span>·</span>
                      <span>Last run {formatDistanceToNow(a.lastRunAt, { addSuffix: true })}</span>
                    </>
                  )}
                </div>
                <ol className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-navy-700">
                  {a.actions.map((step, i) => (
                    <li key={i} className="inline-flex items-center gap-1 rounded-md bg-navy-100 px-2 py-1">
                      <span className="text-navy-400">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Play className="h-3.5 w-3.5" /> Run
                </Button>
                <Switch checked={a.isActive} onChange={() => toggle(a.id)} />
              </div>
            </div>
          ))}
        </div>

        {/* builder (collapsed preview) */}
        {builder && (
          <div className="mt-8 rounded-modal border border-indigo-200 bg-white p-6 shadow-card">
            <h3 className="mb-1 text-[14px] font-semibold text-navy-900">New automation</h3>
            <p className="mb-5 text-xs text-navy-500">Three steps. Under a minute.</p>

            <Step
              number={1}
              title="Choose a trigger"
              body={
                <div className="grid gap-2 sm:grid-cols-2">
                  {["New email from VIP", "Meeting booked", "Task overdue", "Daily at 8am"].map((t) => (
                    <button key={t} className="rounded-lg border border-navy-200 bg-white p-3 text-left text-sm hover:bg-navy-50">
                      <b>{t}</b>
                      <div className="text-xs text-navy-500">Fires whenever this event happens.</div>
                    </button>
                  ))}
                </div>
              }
            />
            <Step
              number={2}
              title="Add conditions (optional)"
              body={<p className="text-sm text-navy-600">Narrow the trigger — e.g. "only from <tag:vip>", "only on weekdays".</p>}
            />
            <Step
              number={3}
              title="Pick actions"
              body={
                <div className="grid gap-2 sm:grid-cols-2">
                  {["Create task", "Draft reply", "Send notification", "Generate document", "Run another automation"].map((a) => (
                    <button key={a} className="flex items-center justify-between rounded-lg border border-navy-200 bg-white p-3 text-left text-sm hover:bg-navy-50">
                      <span>{a}</span>
                      <ArrowRight className="h-4 w-4 text-navy-400" />
                    </button>
                  ))}
                </div>
              }
            />
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setBuilder(false)}>Cancel</Button>
              <Button variant="outline">
                Test run
              </Button>
              <Button>
                <CheckCircle2 className="h-4 w-4" /> Create automation
              </Button>
            </div>
          </div>
        )}

        {/* templates */}
        <h3 className="mb-3 mt-10 text-sm font-semibold text-navy-900">Pre-built playbooks</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {PLAYBOOK_TEMPLATES.map((p) => (
            <div key={p.name} className="group flex items-start gap-3 rounded-card border border-navy-200 bg-white p-4 shadow-card transition hover:shadow-lift">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Zap className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-navy-900">{p.name}</div>
                <div className="text-xs text-navy-500">{p.blurb}</div>
              </div>
              <Button variant="outline" size="sm">Use</Button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 rounded-card border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4" />
          Automations run with your connected account. You can require approval for any action in Settings → AI behavior.
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, body }: { number: number; title: string; body: React.ReactNode }) {
  return (
    <div className="mb-5 rounded-lg border border-navy-200 bg-navy-50/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold text-white">
          {number}
        </span>
        <span className="text-[13px] font-semibold text-navy-900">{title}</span>
      </div>
      {body}
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative h-5 w-9 rounded-full transition",
        checked ? "bg-indigo-600" : "bg-navy-200",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
          checked ? "left-[18px]" : "left-0.5",
        )}
      />
    </button>
  );
}
