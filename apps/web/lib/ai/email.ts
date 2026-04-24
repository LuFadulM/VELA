import { getAnthropic, isAIEnabled, DEFAULT_MODEL, extractJSON } from "./client";
import type { EmailThread, RequiredAction, Sentiment, Tone } from "@/types";

export interface EmailAnalysis {
  summary: string;
  urgencyScore: number; // 1–10
  requiredAction: RequiredAction;
  actionItems: string[];
  sentiment: Sentiment;
  suggestedReply: string;
  tags: string[];
}

/**
 * Analyze a single email thread. Returns summary, urgency, action, and a
 * suggested reply in the operator's voice. Falls back to the pre-baked
 * mock analysis when no API key is configured.
 */
export async function analyzeEmailThread(
  thread: Pick<
    EmailThread,
    "subject" | "participants" | "body" | "aiSummary" | "urgencyScore" | "requiredAction" | "sentiment" | "draftReply" | "tags"
  >,
): Promise<EmailAnalysis> {
  if (!isAIEnabled()) {
    return {
      summary: thread.aiSummary ?? "",
      urgencyScore: thread.urgencyScore,
      requiredAction: thread.requiredAction,
      actionItems: [],
      sentiment: thread.sentiment,
      suggestedReply: thread.draftReply ?? "",
      tags: thread.tags,
    };
  }

  const client = getAnthropic();
  const prompt = `You are Vela, an AI operations copilot for an executive assistant.
Analyze this email thread and return ONLY JSON matching the schema.

Thread:
From: ${thread.participants[0]?.name ?? "Unknown"} <${thread.participants[0]?.email ?? ""}>
Subject: ${thread.subject}
Body:
${thread.body}

Return JSON with fields:
{
  "summary": "3-bullet max, one sentence each, separated by newlines",
  "urgencyScore": integer 1-10,
  "requiredAction": "reply" | "fyi" | "schedule" | "delegate" | "none",
  "actionItems": string[],
  "sentiment": "positive" | "neutral" | "negative" | "urgent",
  "suggestedReply": "draft reply in the EA's voice — professional, concise, ready to send",
  "tags": string[]
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
  return extractJSON<EmailAnalysis>(text);
}

/**
 * Redraft a reply in a specific tone, optionally incorporating extra context
 * (e.g., "mention that Marcus is out Tuesday"). Kept intentionally small so
 * the UI can call this on every tone-selector change.
 */
export async function draftReply(
  thread: Pick<EmailThread, "subject" | "body" | "participants">,
  tone: Tone,
  context?: string,
): Promise<string> {
  if (!isAIEnabled()) {
    return `Thanks for the note — will get back to you shortly.\n\n[Mock reply • tone: ${tone}]`;
  }

  const client = getAnthropic();
  const toneHint: Record<Tone, string> = {
    Professional: "Polished, warm, thorough. Never stuffy.",
    Friendly: "Casual and human. First names. One contraction per sentence is fine.",
    Direct: "Crisp and decisive. 2–3 sentences max. No pleasantries beyond the opener.",
    Brief: "The absolute minimum words to be unambiguous and polite.",
  };

  const prompt = `Draft a reply to this email as if you are Sarah (EA to the CEO).
Tone: ${tone} — ${toneHint[tone]}

${context ? `Extra context: ${context}\n` : ""}

From: ${thread.participants[0]?.name ?? "Unknown"}
Subject: ${thread.subject}
Body:
${thread.body}

Return ONLY the reply body (no subject line, no sign-off scaffolding beyond "Best, Sarah").`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

/**
 * Triage a batch of threads — returns them reordered by urgency taking
 * principal preferences into account (e.g., VIP contacts, current quarter
 * focus areas, time zones).
 */
export async function triage(
  threads: EmailThread[],
  principalPreferences: { vipTags?: string[]; focusAreas?: string[] } = {},
): Promise<EmailThread[]> {
  const vipSet = new Set((principalPreferences.vipTags ?? ["vip", "board"]).map((t) => t.toLowerCase()));
  const focusSet = new Set((principalPreferences.focusAreas ?? []).map((t) => t.toLowerCase()));

  return [...threads].sort((a, b) => {
    const aVip = a.tags.some((t) => vipSet.has(t.toLowerCase())) ? 1 : 0;
    const bVip = b.tags.some((t) => vipSet.has(t.toLowerCase())) ? 1 : 0;
    if (aVip !== bVip) return bVip - aVip;
    const aFocus = a.tags.some((t) => focusSet.has(t.toLowerCase())) ? 1 : 0;
    const bFocus = b.tags.some((t) => focusSet.has(t.toLowerCase())) ? 1 : 0;
    if (aFocus !== bFocus) return bFocus - aFocus;
    if (a.urgencyScore !== b.urgencyScore) return b.urgencyScore - a.urgencyScore;
    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
  });
}
