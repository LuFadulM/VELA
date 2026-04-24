import { getAnthropic, isAIEnabled, DEFAULT_MODEL } from "./client";
import type { AgendaItem, EmailThread, Meeting, Task } from "@/types";

async function generate(prompt: string, maxTokens = 1500): Promise<string> {
  if (!isAIEnabled()) {
    return "# Document generated in mock mode\n\n*Set `ANTHROPIC_API_KEY` to enable real generation.*\n\n" +
      prompt.slice(0, 300);
  }
  const client = getAnthropic();
  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function generateWeeklyBriefing(args: {
  tasks: Task[];
  meetings: Meeting[];
  emails: EmailThread[];
  weekLabel: string;
}): Promise<string> {
  const prompt = `You are Vela. Produce a concise weekly operations briefing in Markdown for an EA's principal (CEO).

Week: ${args.weekLabel}

Upcoming meetings (${args.meetings.length}):
${args.meetings.map((m) => `- ${m.startTime.toDateString()} — ${m.title}`).join("\n")}

Urgent/high-priority tasks:
${args.tasks
  .filter((t) => t.priority === "URGENT" || t.priority === "HIGH")
  .map((t) => `- [${t.status}] ${t.title} (due ${t.dueDate.toDateString()})`)
  .join("\n")}

Urgent emails (${args.emails.length}):
${args.emails.slice(0, 6).map((e) => `- ${e.subject} — ${e.aiSummary}`).join("\n")}

Format:
# This week at a glance
**Top priority:** …

## Meetings
- …

## What needs your attention
- …

## Waiting on you
- …

End with one line: what Vela recommends you do first today.`;

  return generate(prompt, 1200);
}

export async function generateTravelItinerary(tripDetails: {
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  preferences?: string;
}): Promise<string> {
  const prompt = `Generate a polished travel itinerary in Markdown.

Destination: ${tripDetails.destination}
Dates: ${tripDetails.startDate} → ${tripDetails.endDate}
Purpose: ${tripDetails.purpose}
Preferences: ${tripDetails.preferences ?? "none specified"}

Include: flights (placeholders), hotel, meetings, meals, ground transport, and a one-page summary at the top.`;
  return generate(prompt, 1800);
}

export async function generateAgenda(meetingDetails: {
  title: string;
  durationMin: number;
  objectives: string[];
  attendees: string[];
}): Promise<AgendaItem[]> {
  if (!isAIEnabled()) {
    const n = Math.max(2, meetingDetails.objectives.length);
    const per = Math.floor(meetingDetails.durationMin / (n + 1));
    return [
      { item: "Context & opening", durationMin: Math.max(5, Math.min(10, per)) },
      ...meetingDetails.objectives.map((o) => ({ item: o, durationMin: per })),
      { item: "Next steps & owners", durationMin: Math.max(5, Math.min(10, per)) },
    ];
  }

  const client = getAnthropic();
  const prompt = `Build a meeting agenda.

Title: ${meetingDetails.title}
Duration: ${meetingDetails.durationMin} minutes
Objectives: ${meetingDetails.objectives.join("; ")}
Attendees: ${meetingDetails.attendees.join(", ")}

Return JSON array of { "item": "...", "durationMin": N, "owner": "..." } — durations must sum to the total.`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]) as AgendaItem[];
  } catch {
    return [];
  }
}

export async function generateSOPDocument(workflowDescription: string): Promise<string> {
  const prompt = `Turn this workflow description into a well-formatted Standard Operating Procedure in Markdown.

${workflowDescription}

Include: purpose, scope, prerequisites, numbered steps, escalation path, and links/tools referenced.`;
  return generate(prompt, 1500);
}
