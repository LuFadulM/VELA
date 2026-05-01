import { NextRequest } from "next/server";
import {
  buildSystemPrompt,
  liveContextFromData,
  streamVelaReply,
  type ChatTurn,
} from "@/lib/ai/chat";
import { mockEmailThreads, mockMeetings, mockProfile, mockTasks, mockUser } from "@/lib/mocks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel free tier defaults to 10s; chat replies routinely take longer
// when Claude is reasoning over context. 30s is the cap on Hobby and is
// re-asserted in vercel.json for clarity.
export const maxDuration = 30;

interface ChatRequest {
  messages: ChatTurn[];
}

/**
 * Server-Sent Events stream for Vela chat. Emits raw text deltas prefixed
 * with "data:" so the client can progressively render the assistant turn.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequest;
  const messages = body.messages ?? [];
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return new Response("No user message", { status: 400 });
  }

  const systemPrompt = buildSystemPrompt({
    userName: mockUser.name,
    profile: mockProfile,
    liveContext: liveContextFromData({
      meetings: mockMeetings,
      tasks: mockTasks,
      emails: mockEmailThreads,
    }),
  });

  const history = messages.slice(0, -1);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of streamVelaReply({
          systemPrompt,
          history,
          userMessage: last.content,
        })) {
          // The wire format mirrors the StreamEvent discriminated union
          // so the client can switch on `type` without reinterpreting.
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
