import { getAnthropic, isAIEnabled, DEFAULT_MODEL, extractJSON } from "./client";
import type { EmailThread, Task, TaskPriority } from "@/types";

export interface ExtractedTask {
  title: string;
  priority: TaskPriority;
  dueDate?: string; // ISO or null
  notes?: string;
}

export async function extractTasksFromEmail(thread: EmailThread): Promise<ExtractedTask[]> {
  if (!isAIEnabled()) {
    return thread.aiActionItems.map((a) => ({
      title: a.label,
      priority: thread.urgencyScore >= 8 ? "URGENT" : thread.urgencyScore >= 6 ? "HIGH" : "MEDIUM",
    }));
  }

  const client = getAnthropic();
  const prompt = `Extract actionable tasks from this email thread. Only surface items that the EA can act on — skip FYIs.

Subject: ${thread.subject}
From: ${thread.participants[0]?.name}
Body:
${thread.body}

Return JSON array:
[{ "title": "...", "priority": "URGENT|HIGH|MEDIUM|LOW", "dueDate": "YYYY-MM-DD or null", "notes": "..." }]`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<ExtractedTask[]>(text);
}

export async function extractTasksFromMeetingNotes(notes: string): Promise<ExtractedTask[]> {
  if (!isAIEnabled()) return [];

  const client = getAnthropic();
  const prompt = `Extract clear action items from these meeting notes. Each should have an owner if mentioned.

${notes}

Return JSON array:
[{ "title": "...", "priority": "URGENT|HIGH|MEDIUM|LOW", "dueDate": "YYYY-MM-DD or null", "notes": "owner: ..." }]`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<ExtractedTask[]>(text);
}

export async function prioritizeTasks(
  tasks: Task[],
  principalContext: { focusAreas?: string[]; quarterGoals?: string[] } = {},
): Promise<{ tasks: Task[]; reasoning: string }> {
  // Cheap, deterministic default: urgent → due-date → priority.
  const priorityWeight: Record<TaskPriority, number> = {
    URGENT: 3,
    HIGH: 2,
    MEDIUM: 1,
    LOW: 0,
  };
  const sorted = [...tasks].sort((a, b) => {
    const pw = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (pw !== 0) return pw;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  if (!isAIEnabled()) {
    return {
      tasks: sorted,
      reasoning: "Sorted by priority, then by due date.",
    };
  }

  return {
    tasks: sorted,
    reasoning: `Sorted by priority then due date. Principal focus areas: ${principalContext.focusAreas?.join(", ") ?? "—"}.`,
  };
}

export async function generateSubtasks(
  task: Pick<Task, "title" | "description">,
): Promise<string[]> {
  if (!isAIEnabled()) {
    return [
      `Clarify scope of "${task.title}"`,
      "Identify owner & stakeholders",
      "Draft first artifact",
      "Review & send",
    ];
  }

  const client = getAnthropic();
  const prompt = `Break this task into 3-6 concrete subtasks. Each should be a single clear action.

Task: ${task.title}
${task.description ? `Description: ${task.description}` : ""}

Return JSON array of strings.`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<string[]>(text);
}

export async function draftFollowUp(task: Task, context?: string): Promise<string> {
  if (!isAIEnabled()) {
    return `Hi — just following up on "${task.title}". Any update?\n\nBest,\nSarah`;
  }

  const client = getAnthropic();
  const prompt = `Draft a short, polite follow-up email for this task.

Task: ${task.title}
Status: ${task.status}
Due: ${task.dueDate.toLocaleDateString()}
${task.description ? `Context: ${task.description}` : ""}
${context ? `Extra: ${context}` : ""}

Return the email body only. Sign as Sarah.`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 250,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

/**
 * Parse a natural-language task description like "Remind Marcus about the Q3
 * budget by Friday" into a structured task. Uses regex fallback when AI is off.
 */
export async function parseNLPTask(input: string): Promise<ExtractedTask> {
  if (!isAIEnabled()) {
    const prioMatch = /\b(urgent|high|medium|low)\b/i.exec(input);
    return {
      title: input.trim(),
      priority: (prioMatch?.[1]?.toUpperCase() as TaskPriority) ?? "MEDIUM",
    };
  }

  const client = getAnthropic();
  const prompt = `Parse this natural-language task description into structured fields:

"${input}"

Today is ${new Date().toDateString()}. Return JSON:
{ "title": "...", "priority": "URGENT|HIGH|MEDIUM|LOW", "dueDate": "YYYY-MM-DD or null", "notes": "..." }`;

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return extractJSON<ExtractedTask>(text);
}
