"use client";
import { Plug, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import type { Integration, IntegrationProvider } from "@/types";

const PROVIDER_META: Record<IntegrationProvider, { label: string; color: string; blurb: string }> = {
  GMAIL: { label: "Gmail", color: "#EA4335", blurb: "Read, send, and triage emails via Vela." },
  OUTLOOK: { label: "Outlook", color: "#0078D4", blurb: "Microsoft 365 inbox access." },
  GOOGLE_CALENDAR: { label: "Google Calendar", color: "#4285F4", blurb: "Event read/write + prep pack generation." },
  OUTLOOK_CALENDAR: { label: "Outlook Calendar", color: "#0078D4", blurb: "Event read/write." },
  SLACK: { label: "Slack", color: "#4A154B", blurb: "Channel signal + notifications." },
  ZOOM: { label: "Zoom", color: "#2D8CFF", blurb: "Join links + transcripts for prep." },
  GOOGLE_DRIVE: { label: "Google Drive", color: "#34A853", blurb: "Store briefs and meeting docs." },
  NOTION: { label: "Notion", color: "#000000", blurb: "Sync docs and task databases." },
  ASANA: { label: "Asana", color: "#F06A6A", blurb: "Mirror tasks to your PM tool." },
  HUBSPOT: { label: "HubSpot", color: "#FF7A59", blurb: "Contact + deal context in place." },
};

const ALL_PROVIDERS: IntegrationProvider[] = [
  "GMAIL", "OUTLOOK", "GOOGLE_CALENDAR", "SLACK", "ZOOM", "GOOGLE_DRIVE", "NOTION", "ASANA", "HUBSPOT",
];

export function IntegrationsView({ integrations }: { integrations: Integration[] }) {
  const byProvider = new Map(integrations.map((i) => [i.provider, i] as const));

  return (
    <div className="flex-1 overflow-y-auto bg-navy-50/40 p-6 scrollbar-thin">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">Integrations</h2>
          <p className="text-xs text-navy-500">
            Connect your tools — Vela uses them to draft, schedule, and follow up on your behalf.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ALL_PROVIDERS.map((p) => {
            const meta = PROVIDER_META[p];
            const int = byProvider.get(p);
            const connected = int?.isActive;
            return (
              <div key={p} className="flex flex-col rounded-card border border-navy-200 bg-white p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white"
                    style={{ background: meta.color }}
                  >
                    <Plug className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[13.5px] font-semibold text-navy-900">{meta.label}</h3>
                      {connected ? (
                        <Badge tone="emerald">
                          <Check className="h-3 w-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge tone="neutral">Not connected</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-navy-500">{meta.blurb}</p>
                  </div>
                </div>

                {int && (
                  <div className="mt-3 space-y-1.5 rounded-md bg-navy-50 p-2.5 text-[11px] text-navy-600">
                    {int.account && <div>Account: <b className="text-navy-800">{int.account}</b></div>}
                    {int.scopes.length > 0 && (
                      <div>
                        Scopes: {int.scopes.join(", ")}
                      </div>
                    )}
                    <div>Last sync: {formatRelativeTime(int.lastSyncAt)}</div>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  {connected ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Sparkles className="h-3.5 w-3.5" /> Sync now
                      </Button>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm" className="w-full">Connect {meta.label}</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
