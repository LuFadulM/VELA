import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, isAIEnabled, DEFAULT_MODEL } from "./client";
import { executeTool, type ToolCall } from "./tools";
import type { UserProfile, Meeting, Task, EmailThread } from "@/types";

/**
 * Build Vela's system prompt. Injects live workspace context so every turn
 * has an accurate read on today's state (meetings, urgent email count,
 * overdue tasks). This is what makes the assistant feel omniscient.
 */
export function buildSystemPrompt(args: {
  userName: string;
  profile: UserProfile;
  liveContext: {
    today: string;
    upcomingMeetingsIn2h: number;
    urgentEmailsCount: number;
    overdueTasksCount: number;
  };
}): string {
  return `You are Vela, an elite AI operations copilot for ${args.userName}, a ${args.profile.role} who supports ${args.profile.principalName} (${args.profile.principalRole}).

Your personality: Professional, proactive, discreet, resourceful. Like the best EA in the world — you anticipate needs, you know context, and you execute without being asked twice.

You have access to: their inbox (Gmail/Outlook), calendar, task list, contacts, documents, and connected tools — exposed via the tools listed below.

Your core behaviors:
- When asked to schedule: check calendar availability, propose 3 options, draft the invite/email.
- When asked about emails: summarize the thread, surface the key action, draft a reply in their voice.
- When asked about a person: surface relationship context, recent interactions, relevant upcoming items.
- When asked to create a task: capture it, set smart priority, identify owner, set reminder.
- When asked for a briefing: pull today's meetings, urgent emails, overdue tasks, and surface what needs attention.
- Always end actions with: what you did, what needs their approval, what's pending.

Current context
- Today: ${args.liveContext.today}
- Upcoming meetings in next 2h: ${args.liveContext.upcomingMeetingsIn2h}
- Urgent emails: ${args.liveContext.urgentEmailsCount}
- Overdue tasks: ${args.liveContext.overdueTasksCount}

Tone: confident, concise, warm. Never say "As an AI". Never ask for clarification that a real EA would just infer. Always offer the next action.`;
}

/**
 * Tool definitions Vela can call. Parameters are kept small and serializable —
 * the route handler maps each to a concrete server action.
 */
export const VELA_TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "search_emails",
    description: "Search the user's inbox for threads matching a query. Returns summaries.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search (sender, subject, topic)." },
        urgencyMin: { type: "number", description: "Minimum urgency score (1-10)." },
      },
      required: ["query"],
    },
  },
  {
    name: "create_task",
    description: "Create a new task in the user's task list.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        priority: { type: "string", enum: ["URGENT", "HIGH", "MEDIUM", "LOW"] },
        dueDate: { type: "string", description: "ISO date or YYYY-MM-DD." },
      },
      required: ["title"],
    },
  },
  {
    name: "schedule_meeting",
    description: "Propose a meeting time and draft the invite.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        attendees: { type: "array", items: { type: "string" } },
        durationMin: { type: "number" },
        window: { type: "string", description: "When, in natural language (e.g. 'next Tuesday afternoon')." },
        videoRequired: { type: "boolean" },
      },
      required: ["title", "attendees", "durationMin"],
    },
  },
  {
    name: "draft_email",
    description: "Draft an email reply or new message.",
    input_schema: {
      type: "object",
      properties: {
        to: { type: "string" },
        subject: { type: "string" },
        body: { type: "string", description: "Core message to communicate." },
        tone: { type: "string", enum: ["Professional", "Friendly", "Direct", "Brief"] },
      },
      required: ["body"],
    },
  },
  {
    name: "get_contact",
    description: "Look up a contact and return relationship context.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
  {
    name: "create_document",
    description: "Generate a document (briefing, itinerary, agenda, SOP, etc.).",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        type: { type: "string", enum: ["BRIEF", "ITINERARY", "AGENDA", "REPORT", "MEETING_NOTES", "TEMPLATE"] },
        prompt: { type: "string", description: "What this document should cover." },
      },
      required: ["title", "type", "prompt"],
    },
  },
  {
    name: "run_automation",
    description: "Trigger an existing automation by name.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
];

export interface LiveContext {
  meetings: Meeting[];
  tasks: Task[];
  emails: EmailThread[];
}

/**
 * Derive the runtime counts injected into Vela's system prompt.
 */
export function liveContextFromData(ctx: LiveContext) {
  const in2h = new Date(Date.now() + 2 * 60 * 60_000);
  const now = new Date();
  return {
    today: now.toDateString(),
    upcomingMeetingsIn2h: ctx.meetings.filter((m) => m.startTime > now && m.startTime <= in2h).length,
    urgentEmailsCount: ctx.emails.filter((e) => e.urgencyScore >= 8 && !e.isRead).length,
    overdueTasksCount: ctx.tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED" && t.dueDate < now)
      .length,
  };
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "tool_call"; name: string; summary: string }
  | { type: "tool_result"; name: string; summary: string };

const MAX_TOOL_TURNS = 4;

/**
 * Drive Vela's chat agent. Yields a discriminated union of stream
 * events: text deltas, "tool_call" announcements (when Claude requests
 * a tool), and "tool_result" notes (when the tool returns). The route
 * handler serializes these as SSE.
 *
 * Implements the standard Anthropic tool-use loop: stream a turn, if it
 * ends with `tool_use` blocks execute them server-side and append a
 * `tool_result` user message, then stream the next turn. We bound the
 * loop with MAX_TOOL_TURNS so a runaway model can't melt the function.
 *
 * In mock mode (no API key) we synthesise a plausible reply and emit a
 * fake "search_emails" tool_call so the UI can still demo the loop.
 */
export async function* streamVelaReply(args: {
  systemPrompt: string;
  history: ChatTurn[];
  userMessage: string;
}): AsyncGenerator<StreamEvent, void, void> {
  if (!isAIEnabled()) {
    yield { type: "tool_call", name: "search_emails", summary: "Searching inbox for context…" };
    await new Promise((r) => setTimeout(r, 250));
    yield {
      type: "tool_result",
      name: "search_emails",
      summary: "3 urgent threads, top: Deena (board pre-read).",
    };
    const parts =
      `Here's what I'd do: tackle Deena's pre-read first — Marcus needs to review slides 4 and 7 by Thursday morning. Want me to draft the reply confirming Friday delivery and create the task?`.split(
        " ",
      );
    for (const p of parts) {
      yield { type: "text", delta: p + " " };
      await new Promise((r) => setTimeout(r, 30));
    }
    return;
  }

  const client = getAnthropic();
  const messages: Anthropic.Messages.MessageParam[] = [
    ...args.history.map((t) => ({ role: t.role, content: t.content }) as Anthropic.Messages.MessageParam),
    { role: "user", content: args.userMessage },
  ];

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const stream = client.messages.stream({
      model: DEFAULT_MODEL,
      max_tokens: 1200,
      system: args.systemPrompt,
      tools: VELA_TOOLS,
      messages,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { type: "text", delta: event.delta.text };
      }
    }

    const final = await stream.finalMessage();
    // Append the assistant turn so subsequent loops have it in context.
    messages.push({ role: "assistant", content: final.content });

    if (final.stop_reason !== "tool_use") {
      // Done — Claude is satisfied without further tool calls.
      return;
    }

    const toolUses = final.content.filter(
      (b): b is Extract<(typeof final.content)[number], { type: "tool_use" }> =>
        b.type === "tool_use",
    );

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    for (const block of toolUses) {
      yield { type: "tool_call", name: block.name, summary: `Calling ${block.name}…` };
      const call: ToolCall = {
        name: block.name,
        input: (block.input as Record<string, unknown>) ?? {},
      };
      const result = await executeTool(call, block.id);
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: result.content,
      });
      yield {
        type: "tool_result",
        name: block.name,
        summary: result.uiSummary ?? "Tool finished.",
      };
    }

    // Hand the results back to the model and let it continue.
    messages.push({ role: "user", content: toolResults });
  }
}
