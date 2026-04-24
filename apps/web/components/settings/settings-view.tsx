"use client";
import { useState } from "react";
import { Sparkles, Shield, Users2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Principal, User, UserProfile, Workspace } from "@/types";

const TABS = ["Profile", "Principals", "AI behavior", "Notifications", "Billing"] as const;
type Tab = (typeof TABS)[number];

const AUTONOMY_LEVELS = [
  { key: "suggest", label: "Suggest only", blurb: "Vela drafts and proposes — you send and confirm every action." },
  { key: "review", label: "Review before send", blurb: "Vela prepares everything, you one-click approve." },
  { key: "auto", label: "Auto-pilot for known flows", blurb: "Vela acts on flows you've pre-approved; holds the rest." },
];

export function SettingsView({
  user,
  profile,
  workspace,
  principal,
}: {
  user: User;
  profile: UserProfile;
  workspace: Workspace;
  principal: Principal;
}) {
  const [tab, setTab] = useState<Tab>("Profile");
  const [autonomy, setAutonomy] = useState<(typeof AUTONOMY_LEVELS)[number]["key"]>("review");

  return (
    <div className="flex-1 overflow-y-auto bg-navy-50/40 p-6 scrollbar-thin">
      <div className="mx-auto flex max-w-5xl gap-6">
        <aside className="w-[200px] flex-none">
          <nav className="sticky top-2 space-y-0.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm",
                  tab === t
                    ? "bg-white font-semibold text-navy-900 shadow-card"
                    : "text-navy-600 hover:bg-navy-100",
                )}
              >
                {t}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {tab === "Profile" && (
            <Section title="Profile" subtitle="How Vela addresses you and sizes its suggestions.">
              <div className="mb-5 flex items-center gap-4">
                <Avatar name={user.name} src={user.avatar ?? undefined} size={56} />
                <div>
                  <div className="text-sm font-semibold text-navy-900">{user.name}</div>
                  <div className="text-xs text-navy-500">{user.email}</div>
                  <Button size="sm" variant="outline" className="mt-2">Change avatar</Button>
                </div>
              </div>
              <Field label="Name" value={user.name} />
              <Field label="Role" value={profile.role} />
              <Field label="Timezone" value={profile.timezone} />
              <Field label="Communication style" value={profile.communicationStyle.toLowerCase()} />
              <div className="mt-4 rounded-lg border border-navy-200 bg-white p-4 text-xs text-navy-600">
                <b>Workspace:</b> {workspace.name} · plan {workspace.plan}
              </div>
            </Section>
          )}

          {tab === "Principals" && (
            <Section title="Principals" subtitle="Who you support. Vela builds a distinct memory for each.">
              <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={principal.name} size={42} />
                    <div>
                      <div className="text-sm font-semibold text-navy-900">{principal.name}</div>
                      <div className="text-xs text-navy-500">{principal.role}</div>
                    </div>
                  </div>
                  <Badge tone="indigo">Primary</Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Email" value={principal.email} />
                  <Field label="Meeting style" value={principal.preferences.meetingStyle ?? "—"} />
                  <Field label="Email tone" value={principal.preferences.emailTone ?? "—"} />
                  <Field label="Relationships" value="3 board members · 4 directs" />
                </div>
              </div>
              <Button className="mt-4" variant="outline">
                <Users2 className="h-3.5 w-3.5" /> Add another principal
              </Button>
            </Section>
          )}

          {tab === "AI behavior" && (
            <Section title="AI behavior" subtitle="How much Vela does on its own.">
              <div className="space-y-3">
                {AUTONOMY_LEVELS.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setAutonomy(l.key as typeof autonomy)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition",
                      autonomy === l.key
                        ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10"
                        : "border-navy-200 bg-white hover:border-navy-300",
                    )}
                  >
                    <Sparkles className={cn("mt-0.5 h-4 w-4", autonomy === l.key ? "text-indigo-600" : "text-navy-400")} />
                    <div>
                      <div className="text-sm font-semibold text-navy-900">{l.label}</div>
                      <div className="text-xs text-navy-500">{l.blurb}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-navy-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-500">
                  <Shield className="h-3.5 w-3.5" /> Always require approval
                </div>
                <ul className="space-y-1.5 text-sm text-navy-700">
                  {[
                    "Sending email to new recipients",
                    "Scheduling meetings outside business hours",
                    "Any outbound action tagged 'board' or 'vip'",
                  ].map((x) => (
                    <li key={x} className="flex items-center justify-between">
                      <span>{x}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">On</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          )}

          {tab === "Notifications" && (
            <Section title="Notifications" subtitle="Where and when Vela pings you.">
              <div className="space-y-2 rounded-card border border-navy-200 bg-white p-4">
                {[
                  ["Urgent VIP email", "in_app, email"],
                  ["Meeting starting in 15m", "in_app"],
                  ["Task overdue", "in_app, email"],
                  ["Automation failed", "in_app, sms"],
                  ["Daily briefing (8am)", "email"],
                ].map(([label, via]) => (
                  <div key={label} className="flex items-center justify-between border-b border-navy-100 py-2 last:border-0">
                    <span className="text-sm text-navy-800">{label}</span>
                    <span className="font-mono text-[11px] text-navy-500">{via}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {tab === "Billing" && (
            <Section title="Billing" subtitle={`You're on ${workspace.plan}.`}>
              <div className="rounded-card border border-navy-200 bg-white p-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">Plan</div>
                    <div className="text-lg font-bold text-navy-900">{workspace.plan}</div>
                  </div>
                  <Button>Change plan</Button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Stat label="This month" value="$39.00" />
                  <Stat label="AI actions used" value="428 / ∞" />
                  <Stat label="Seats" value="1 of 1" />
                </div>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-modal border border-navy-200 bg-white p-6 shadow-card">
      <h2 className="text-[15px] font-semibold tracking-tight text-navy-900">{title}</h2>
      {subtitle && <p className="mb-5 text-xs text-navy-500">{subtitle}</p>}
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-500">{label}</span>
      <Input value={value} readOnly />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-navy-50 p-3">
      <div className="text-[10.5px] uppercase tracking-wide text-navy-500">{label}</div>
      <div className="text-sm font-semibold text-navy-900">{value}</div>
    </div>
  );
}
