"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Mail,
  CalendarClock,
  ListChecks,
  UserSquare,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; blurb: string }[] = [
  { value: "EA", label: "Executive Assistant", blurb: "I support one or two senior leaders." },
  { value: "OPS_MANAGER", label: "Operations Manager", blurb: "I run ops across a team or function." },
  { value: "OPS_ASSISTANT", label: "Operations Assistant", blurb: "I support an ops team's day-to-day." },
  { value: "VA", label: "Virtual Assistant", blurb: "I support multiple clients remotely." },
];

const INTEGRATIONS = [
  { key: "GMAIL", label: "Gmail", blurb: "Recommended — inbox is Vela's heartbeat.", icon: Mail, recommended: true },
  { key: "OUTLOOK", label: "Outlook", blurb: "Microsoft 365 email and calendar.", icon: Mail },
  { key: "GOOGLE_CALENDAR", label: "Google Calendar", blurb: "Scheduling & prep packs.", icon: CalendarClock },
  { key: "SLACK", label: "Slack", blurb: "Team signal + notifications.", icon: Sparkles },
];

const WORKFLOWS = [
  { key: "scheduling", label: "Scheduling", blurb: "Calendar first — cut the back-and-forth.", icon: CalendarClock },
  { key: "email", label: "Email triage", blurb: "Inbox first — reply in your voice.", icon: Mail },
  { key: "tasks", label: "Task tracking", blurb: "Tasks first — nothing falls through.", icon: ListChecks },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("EA");
  const [principalName, setPrincipalName] = useState("");
  const [principalRole, setPrincipalRole] = useState("");
  const [principalEmail, setPrincipalEmail] = useState("");
  const [integration, setIntegration] = useState<string | null>("GMAIL");
  const [workflow, setWorkflow] = useState<string | null>("email");

  const canContinue =
    (step === 1 && !!role) ||
    (step === 2 && principalName.trim().length > 1) ||
    (step === 3 && !!integration) ||
    (step === 4 && !!workflow);

  function next() {
    if (step < 4) setStep(step + 1);
    else router.push("/dashboard");
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-modal border border-navy-200 bg-white shadow-card">
        {/* step header */}
        <div className="border-b border-navy-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy-500">Step {step} of 4</div>
            <Link href="/" className="text-xs text-navy-500 hover:text-navy-900">Cancel</Link>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={cn(
                  "h-1 flex-1 rounded-full transition",
                  n <= step ? "bg-indigo-500" : "bg-navy-200",
                )}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[360px] p-7">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">What do you do?</h2>
                <p className="mt-1 text-sm text-navy-500">Vela tunes its suggestions to your role.</p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
                        role === r.value
                          ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10"
                          : "border-navy-200 bg-white hover:border-navy-300",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-semibold text-navy-900">{r.label}</span>
                        {role === r.value && <Check className="h-4 w-4 text-indigo-600" />}
                      </div>
                      <span className="text-sm text-navy-500">{r.blurb}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">Who do you support?</h2>
                <p className="mt-1 text-sm text-navy-500">Vela learns your principal's voice and preferences over time.</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-600">
                      Name
                    </label>
                    <Input value={principalName} onChange={(e) => setPrincipalName(e.target.value)} placeholder="Marcus Webb" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-600">
                        Title
                      </label>
                      <Input value={principalRole} onChange={(e) => setPrincipalRole(e.target.value)} placeholder="CEO" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-600">
                        Email (optional)
                      </label>
                      <Input type="email" value={principalEmail} onChange={(e) => setPrincipalEmail(e.target.value)} placeholder="marcus@northwind.co" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">
                    <UserSquare className="mt-0.5 h-4 w-4 flex-none" />
                    You can add more principals later — Vela Teams supports pooled ops for multi-principal coverage.
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">Connect your first tool</h2>
                <p className="mt-1 text-sm text-navy-500">
                  Gmail is the fastest path to your first "wow" moment — Vela will surface the 5 emails that need you most.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {INTEGRATIONS.map((i) => {
                    const active = integration === i.key;
                    return (
                      <button
                        key={i.key}
                        onClick={() => setIntegration(i.key)}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 text-left transition",
                          active
                            ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10"
                            : "border-navy-200 bg-white hover:border-navy-300",
                        )}
                      >
                        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white text-indigo-600 shadow-card">
                          <i.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-navy-900">{i.label}</span>
                            {i.recommended && (
                              <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">Recommended</span>
                            )}
                          </div>
                          <div className="text-xs text-navy-500">{i.blurb}</div>
                        </div>
                        {active && <Check className="mt-1 h-4 w-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-navy-500">You can skip this step — we'll start you in demo mode with realistic sample data.</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">Pick your primary workflow</h2>
                <p className="mt-1 text-sm text-navy-500">We'll drop you into the module that matches how you start most days.</p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {WORKFLOWS.map((w) => {
                    const active = workflow === w.key;
                    return (
                      <button
                        key={w.key}
                        onClick={() => setWorkflow(w.key)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-xl border p-5 text-left transition",
                          active
                            ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10"
                            : "border-navy-200 bg-white hover:border-navy-300",
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-card">
                          <w.icon className="h-5 w-5" />
                        </div>
                        <span className="font-semibold text-navy-900">{w.label}</span>
                        <span className="text-xs text-navy-500">{w.blurb}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-900">
                  <b>Ready to go.</b> You'll land in your {workflow === "scheduling" ? "Calendar" : workflow === "tasks" ? "Tasks" : "Inbox"} with 15 emails, 8 meetings, and 20 tasks pre-loaded — so you can explore immediately.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-navy-100 px-7 py-4">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={next} disabled={!canContinue}>
            {step === 4 ? "Enter Vela" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
