import Anthropic from "@anthropic-ai/sdk";

/**
 * Shared Anthropic client. We default to `claude-sonnet-4-6` for the AI
 * service layer (fast enough for interactive UIs, strong enough for tool
 * use). Individual callers can override via the `model` argument.
 */
export const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (_client) return _client;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Vela falls back to mock output when " +
        "the key is missing — callers should check `isAIEnabled()` first.",
    );
  }
  _client = new Anthropic({ apiKey: key });
  return _client;
}

export function isAIEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Best-effort JSON extractor. Claude will sometimes wrap JSON in prose or
 * fenced code blocks; we strip those and parse. Throws if no JSON is found.
 */
export function extractJSON<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1] ?? raw;
  const start = candidate.indexOf("{");
  const arrayStart = candidate.indexOf("[");
  const idx =
    start === -1 ? arrayStart : arrayStart === -1 ? start : Math.min(start, arrayStart);
  if (idx === -1) throw new Error("No JSON found in AI response");
  const jsonText = candidate.slice(idx);
  return JSON.parse(jsonText) as T;
}
