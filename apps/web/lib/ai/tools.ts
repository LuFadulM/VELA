/**
 * Server-side tool executor for Vela's chat agent. Each function
 * implements one of the tools declared in lib/ai/chat.ts and returns a
 * compact, model-friendly summary that gets handed back as a
 * `tool_result` content block.
 *
 * Today these run against mock data so the demo workspace feels alive.
 * When the workspace is wired to the real DB, swap each implementation
 * for its Prisma equivalent — the contract is unchanged.
 */
import {
  mockEmailThreads,
  mockTasks,
  mockMeetings,
  mockContacts,
  mockAutomations,
  mockDocuments,
  getEmailThread,
} from "@/lib/mocks";
import type { Tone } from "@/types";

export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResult {
  /** The tool_use_id from the model — required for the round-trip. */
  tool_use_id: string;
  /** Stringified payload returned to the model. */
  content: string;
  /** Human-readable summary surfaced as an "action card" in the UI. */
  uiSummary?: string;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function asNumber(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

export async function executeTool(
  call: ToolCall,
  tool_use_id: string,
): Promise<ToolResult> {
  switch (call.name) {
    case "search_emails": {
      const query = asString(call.input.query).toLowerCase();
      const urgencyMin = asNumber(call.input.urgencyMin) ?? 0;
      const matches = mockEmailThreads
        .filter((t) => t.urgencyScore >= urgencyMin)
        .filter((t) => {
          const haystack = `${t.subject} ${t.aiSummary} ${t.participants.map((p) => p.name).join(" ")}`.toLowerCase();
          return haystack.includes(query);
        })
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          from: t.participants[0]?.name,
          subject: t.subject,
          urgency: t.urgencyScore,
          summary: t.aiSummary,
        }));
      return {
        tool_use_id,
        content: JSON.stringify({ matches }),
        uiSummary: `Searched inbox for "${query}" — ${matches.length} match${matches.length === 1 ? "" : "es"}.`,
      };
    }

    case "create_task": {
      const title = asString(call.input.title, "Untitled");
      const priority = asString(call.input.priority, "MEDIUM");
      const dueDate = asString(call.input.dueDate);
      const newTask = {
        id: `tk_new_${Date.now()}`,
        title,
        priority,
        dueDate: dueDate || null,
        status: "TODO" as const,
      };
      return {
        tool_use_id,
        content: JSON.stringify({ created: newTask }),
        uiSummary: `Created task "${title}" (${priority.toLowerCase()})${dueDate ? `, due ${dueDate}` : ""}.`,
      };
    }

    case "schedule_meeting": {
      const title = asString(call.input.title, "Meeting");
      const attendees = Array.isArray(call.input.attendees) ? call.input.attendees : [];
      const durationMin = asNumber(call.input.durationMin) ?? 30;
      const window = asString(call.input.window, "this week");
      // Propose three plausible slots starting tomorrow morning.
      const base = new Date();
      base.setDate(base.getDate() + 1);
      const slots = [9, 11, 14].map((h) => {
        const d = new Date(base);
        d.setHours(h, 0, 0, 0);
        return d.toISOString();
      });
      return {
        tool_use_id,
        content: JSON.stringify({ proposedSlots: slots, attendees, durationMin, window, title }),
        uiSummary: `Proposed 3 slots for "${title}" with ${attendees.length} attendee${attendees.length === 1 ? "" : "s"} (${durationMin}m).`,
      };
    }

    case "draft_email": {
      const to = asString(call.input.to, "—");
      const subject = asString(call.input.subject, "(no subject)");
      const tone = asString(call.input.tone, "Professional") as Tone;
      const body = asString(call.input.body, "");
      const draft = `${body}\n\nBest,\nSarah`;
      return {
        tool_use_id,
        content: JSON.stringify({ draft, to, subject, tone }),
        uiSummary: `Drafted ${tone.toLowerCase()} email to ${to} — "${subject}".`,
      };
    }

    case "get_contact": {
      const name = asString(call.input.name).toLowerCase();
      const c =
        mockContacts.find((x) => x.name.toLowerCase().includes(name)) ??
        mockContacts.find((x) => x.email.toLowerCase().includes(name));
      if (!c) {
        return {
          tool_use_id,
          content: JSON.stringify({ found: false }),
          uiSummary: `No contact matched "${name}".`,
        };
      }
      return {
        tool_use_id,
        content: JSON.stringify({
          found: true,
          name: c.name,
          role: c.role,
          company: c.company,
          relationshipStrength: c.relationshipStrength,
          lastContactDate: c.lastContactDate.toISOString(),
          interactionCount: c.interactionCount,
          notes: c.notes,
          tags: c.tags,
        }),
        uiSummary: `Pulled context on ${c.name} (${c.role} at ${c.company}).`,
      };
    }

    case "create_document": {
      const title = asString(call.input.title, "Untitled doc");
      const type = asString(call.input.type, "BRIEF");
      return {
        tool_use_id,
        content: JSON.stringify({ created: { id: `d_new_${Date.now()}`, title, type } }),
        uiSummary: `Generated ${type.toLowerCase()} doc "${title}".`,
      };
    }

    case "run_automation": {
      const name = asString(call.input.name);
      const a = mockAutomations.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!a) {
        return {
          tool_use_id,
          content: JSON.stringify({ ok: false, reason: "automation_not_found" }),
          uiSummary: `Automation "${name}" not found.`,
        };
      }
      return {
        tool_use_id,
        content: JSON.stringify({ ok: true, name: a.name, actions: a.actions }),
        uiSummary: `Ran "${a.name}" — ${a.actions.length} actions queued.`,
      };
    }

    default:
      return {
        tool_use_id,
        content: JSON.stringify({ error: `unknown_tool:${call.name}` }),
        uiSummary: `(Unknown tool: ${call.name})`,
      };
  }
}

// Suppress unused-import warning when only used inside default mock-mode branch.
void mockTasks;
void mockMeetings;
void mockDocuments;
void getEmailThread;
