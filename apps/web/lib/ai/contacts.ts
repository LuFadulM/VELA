import { getAnthropic, isAIEnabled, DEFAULT_MODEL, extractJSON } from "./client";
import type { Contact, EmailThread, Meeting } from "@/types";

export interface ContactBrief {
  summary: string;
  relationshipHealth: string;
  lastInteractionContext: string;
  communicationTips: string[];
  upcomingRelevantContext: string;
}

export async function buildContactBrief(
  contact: Contact,
  interactions: { emails: EmailThread[]; meetings: Meeting[] },
): Promise<ContactBrief> {
  if (!isAIEnabled()) {
    const recentEmail = interactions.emails[0];
    return {
      summary: `${contact.name} — ${contact.role} at ${contact.company}. ${contact.relationshipStrength} relationship with ${contact.interactionCount} total interactions.`,
      relationshipHealth:
        contact.relationshipStrength === "STRONG"
          ? "Healthy — consistent recent touch."
          : contact.relationshipStrength === "MEDIUM"
            ? "Active but could warm up — consider a check-in."
            : "Sparse — treat any outreach as a re-engagement.",
      lastInteractionContext: recentEmail
        ? `Last email: "${recentEmail.subject}" — ${recentEmail.aiSummary}`
        : `Last contact: ${contact.lastContactDate.toLocaleDateString()}`,
      communicationTips:
        contact.notes?.split(". ").filter(Boolean) ?? [
          "Match their communication cadence",
          "Lead with the ask, context second",
        ],
      upcomingRelevantContext:
        interactions.meetings[0]
          ? `Next meeting: "${interactions.meetings[0].title}" on ${interactions.meetings[0].startTime.toLocaleDateString()}`
          : "No upcoming meetings.",
    };
  }

  const client = getAnthropic();
  const prompt = `You are Vela. Build a relationship brief the EA can glance at before writing or meeting.

Contact:
- Name: ${contact.name}
- Role: ${contact.role} at ${contact.company}
- Relationship: ${contact.relationshipStrength}
- Interactions: ${contact.interactionCount}
- Last contact: ${contact.lastContactDate.toLocaleDateString()}
- Notes: ${contact.notes ?? "—"}
- Tags: ${contact.tags.join(", ")}

Recent emails:
${interactions.emails.slice(0, 5).map((e) => `- "${e.subject}": ${e.aiSummary}`).join("\n") || "(none)"}

Upcoming meetings:
${interactions.meetings.slice(0, 3).map((m) => `- ${m.title} on ${m.startTime.toLocaleDateString()}`).join("\n") || "(none)"}

Return JSON:
{
  "summary": "2-sentence snapshot",
  "relationshipHealth": "one sentence",
  "lastInteractionContext": "one sentence",
  "communicationTips": ["..."],
  "upcomingRelevantContext": "one sentence"
}`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<ContactBrief>(text);
}
