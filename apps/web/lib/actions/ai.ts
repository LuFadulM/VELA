"use server";
import { draftReply } from "@/lib/ai/email";
import { generateSubtasks } from "@/lib/ai/tasks";
import { generatePrepPack } from "@/lib/ai/meetings";
import { mockContacts, mockEmailThreads, getEmailThread, getMeeting } from "@/lib/mocks";
import type { Tone, Task } from "@/types";

/**
 * Server action — regenerate a thread's draft reply at a specific tone.
 * Returns the new draft string. Invoked by the inbox tone selector.
 *
 * Falls back to canned text from the AI service when ANTHROPIC_API_KEY
 * isn't set, so the UI affordance stays interactive in mock mode.
 */
export async function regenerateDraftAction(args: {
  threadId: string;
  tone: Tone;
  context?: string;
}): Promise<{ draft: string }> {
  const thread = getEmailThread(args.threadId);
  if (!thread) throw new Error(`Thread ${args.threadId} not found`);
  const draft = await draftReply(thread, args.tone, args.context);
  return { draft };
}

/**
 * Server action — generate subtasks for a given task. Returns plain
 * strings; the caller wraps them into the local subtasks state.
 */
export async function generateSubtasksAction(task: {
  title: string;
  description?: string;
}): Promise<{ subtasks: string[] }> {
  const subtasks = await generateSubtasks(task);
  return { subtasks };
}

/**
 * Server action — generate (or regenerate) a meeting prep pack.
 * Pulls the meeting from mock data, joins it with the contact graph
 * and any urgent recent emails, then asks the AI service for the pack.
 */
export async function generatePrepPackAction(args: {
  meetingId: string;
}): Promise<{
  contextBrief: string;
  agendaCount: number;
}> {
  const meeting = getMeeting(args.meetingId);
  if (!meeting) throw new Error(`Meeting ${args.meetingId} not found`);
  const recentEmails = mockEmailThreads
    .filter((e) => e.urgencyScore >= 6)
    .slice(0, 4);
  const pack = await generatePrepPack(meeting, mockContacts, recentEmails);
  return {
    contextBrief: pack.contextBrief,
    agendaCount: pack.agenda.length,
  };
}
