import type { Automation } from "@/types";

export const mockAutomations: Automation[] = [
  {
    id: "a_01",
    name: "New Meeting Booked",
    description:
      "When a calendar event is created → generate a prep pack, send a 30-min reminder, capture notes during, and draft a follow-up after.",
    isActive: true,
    triggerLabel: "Calendar event created",
    actions: [
      "Generate prep pack",
      "Schedule reminder 30m before",
      "Capture notes during meeting",
      "Draft follow-up email",
    ],
    runCount: 12,
    lastRunAt: new Date(Date.now() - 2 * 60 * 60_000),
    errorCount: 0,
  },
  {
    id: "a_02",
    name: "VIP Email Received",
    description:
      "When an email arrives from a VIP contact → raise urgency, draft a reply in your voice, and create a task if action is needed.",
    isActive: true,
    triggerLabel: "Email received (tag: VIP)",
    actions: ["Set urgency high", "Draft reply (professional tone)", "Create task if actionable"],
    runCount: 48,
    lastRunAt: new Date(Date.now() - 40 * 60_000),
    errorCount: 0,
  },
  {
    id: "a_03",
    name: "Weekly Ops Briefing",
    description:
      "Every Monday at 8am ET → compile pending tasks, this week's meetings, and outstanding emails into a briefing doc.",
    isActive: true,
    triggerLabel: "Schedule — Mon 08:00 ET",
    actions: ["Compile agenda", "Generate briefing document", "Send to principal"],
    runCount: 6,
    lastRunAt: new Date(Date.now() - 3 * 24 * 60 * 60_000),
    errorCount: 0,
  },
  {
    id: "a_04",
    name: "Expense Approval Flow",
    description:
      "When an expense email arrives → extract amount + vendor → create approval task → nudge if stale after 48h.",
    isActive: false,
    triggerLabel: "Email received (expense)",
    actions: ["Extract amount + vendor", "Create approval task", "Nudge after 48h"],
    runCount: 0,
    lastRunAt: null,
    errorCount: 0,
  },
];
