import { getAnthropic, isAIEnabled, DEFAULT_MODEL, extractJSON } from "./client";
import type { AgendaItem, ActionItem, Contact, EmailThread, Meeting } from "@/types";

export interface AttendeeProfile {
  name: string;
  role: string;
  relationshipStrength: string;
  recentTouchpoints: string[];
  suggestedConversation: string;
}

export interface PrepPack {
  agenda: AgendaItem[];
  attendeeProfiles: AttendeeProfile[];
  contextBrief: string;
  suggestedTopics: string[];
  relevantDocuments: string[];
}

export async function generatePrepPack(
  meeting: Meeting,
  contacts: Contact[],
  recentEmails: EmailThread[],
): Promise<PrepPack> {
  if (!isAIEnabled()) {
    return {
      agenda:
        meeting.agenda ??
        [
          { item: "Context & updates", durationMin: 10 },
          { item: "Key decisions", durationMin: 20 },
          { item: "Next steps & owners", durationMin: 10 },
        ],
      attendeeProfiles: meeting.attendees.map((a) => {
        const c = contacts.find((x) => x.email === a.email || x.name === a.name);
        return {
          name: a.name,
          role: c?.role ?? "—",
          relationshipStrength: c?.relationshipStrength ?? "UNKNOWN",
          recentTouchpoints: c ? [`Last contact ${c.lastContactDate.toLocaleDateString()}`] : [],
          suggestedConversation:
            c?.notes?.split("\n")[0] ?? "Ask about their current priorities and blockers.",
        };
      }),
      contextBrief:
        `Prepping for "${meeting.title}" with ${meeting.attendees.length} attendee${meeting.attendees.length === 1 ? "" : "s"}. ` +
        (recentEmails.length > 0
          ? `${recentEmails.length} relevant email${recentEmails.length === 1 ? "" : "s"} in the last 7 days. `
          : "") +
        "Main objective: align on next steps.",
      suggestedTopics: [
        "Confirm scope & timeline",
        "Surface any blockers",
        "Agree on next owner + deadline",
      ],
      relevantDocuments: [],
    };
  }

  const client = getAnthropic();
  const prompt = `You are Vela. Generate a meeting prep pack for the executive.

Meeting: ${meeting.title}
When: ${meeting.startTime.toISOString()} (${meeting.timezone})
Attendees: ${meeting.attendees.map((a) => `${a.name} <${a.email}>`).join(", ")}

Relevant contacts:
${contacts.map((c) => `- ${c.name} (${c.role} at ${c.company}) — ${c.relationshipStrength}, last contact ${c.lastContactDate.toLocaleDateString()}${c.notes ? ` · ${c.notes}` : ""}`).join("\n") || "(none)"}

Recent emails:
${recentEmails.map((e) => `- "${e.subject}" from ${e.participants[0]?.name} — ${e.aiSummary}`).join("\n") || "(none)"}

Return JSON:
{
  "agenda": [{ "item": "...", "durationMin": 10, "owner": "..." }],
  "attendeeProfiles": [{ "name": "...", "role": "...", "relationshipStrength": "STRONG|MEDIUM|WEAK|UNKNOWN", "recentTouchpoints": ["..."], "suggestedConversation": "..." }],
  "contextBrief": "...",
  "suggestedTopics": ["..."],
  "relevantDocuments": ["..."]
}`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<PrepPack>(text);
}

export interface MeetingNotes {
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  followUpDraft: string;
}

export async function generateMeetingNotes(raw: string): Promise<MeetingNotes> {
  if (!isAIEnabled()) {
    return {
      summary: "Meeting notes summary (AI disabled — configure ANTHROPIC_API_KEY).",
      keyDecisions: [],
      actionItems: [],
      followUpDraft: "",
    };
  }

  const client = getAnthropic();
  const prompt = `Extract a clean summary, decisions, action items, and a follow-up email draft from these meeting notes:

${raw}

Return JSON:
{
  "summary": "3-5 sentence overview",
  "keyDecisions": ["..."],
  "actionItems": [{ "title": "...", "owner": "...", "dueDate": "YYYY-MM-DD or null" }],
  "followUpDraft": "short follow-up email"
}`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<MeetingNotes>(text);
}

export interface TimeSlot {
  start: string;
  end: string;
  timezone: string;
  label: string;
}

export interface NLPSchedulingResult {
  suggestedSlots: TimeSlot[];
  schedulingEmail: string;
  considerations: string[];
}

export async function scheduleWithNLP(
  instruction: string,
  availability: TimeSlot[],
  preferences: { attendeeCount?: number; videoPreferred?: boolean } = {},
): Promise<NLPSchedulingResult> {
  if (!isAIEnabled()) {
    return {
      suggestedSlots: availability.slice(0, 3),
      schedulingEmail: `Hi — proposing three times for the discussion:\n\n${availability
        .slice(0, 3)
        .map((s) => `• ${s.label}`)
        .join("\n")}\n\nLet me know which works best.\n\nBest,\nSarah`,
      considerations: [
        `Based on: "${instruction}"`,
        preferences.videoPreferred ? "Video preferred — will include Zoom link." : "Will confirm location.",
      ],
    };
  }

  const client = getAnthropic();
  const prompt = `You are Vela, a scheduling assistant. The user asked:

"${instruction}"

Available windows:
${availability.map((s) => `- ${s.label} (${s.start} → ${s.end})`).join("\n")}

Attendee count: ${preferences.attendeeCount ?? "unspecified"}
Video preferred: ${preferences.videoPreferred ? "yes" : "no"}

Return JSON:
{
  "suggestedSlots": [{ "start": "ISO", "end": "ISO", "timezone": "IANA", "label": "Mon Apr 21, 2:00 PM ET" }],
  "schedulingEmail": "email body proposing the slots",
  "considerations": ["scheduling constraints you applied"]
}`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<NLPSchedulingResult>(text);
}
