import { NextResponse, type NextRequest } from "next/server";
import { generateWeeklyBriefing } from "@/lib/ai/documents";
import { mockEmailThreads, mockMeetings, mockTasks } from "@/lib/mocks";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Cron handler for the "Weekly Ops Briefing" automation. Wired up in
 * `vercel.json` to run Mondays at 13:00 UTC (8am Eastern). On the free
 * tier you get one cron — this is it.
 *
 * Vercel signs cron invocations with `Authorization: Bearer <CRON_SECRET>`
 * (the secret is auto-set if you use the dashboard). We refuse anything
 * else when the secret is configured. In dev / when the secret isn't
 * set we run anyway so it's testable with curl.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const now = new Date();
  const weekLabel = now.toISOString().slice(0, 10);

  const briefing = await generateWeeklyBriefing({
    tasks: mockTasks,
    meetings: mockMeetings.filter((m) => m.startTime >= now),
    emails: mockEmailThreads.filter((e) => e.urgencyScore >= 7),
    weekLabel,
  });

  // In a real deploy we'd persist this Document and email it to the
  // principal; in mock mode we return it as the response body so the
  // operator can see what would be sent.
  return NextResponse.json({
    ok: true,
    week: weekLabel,
    briefing,
    generatedAt: now.toISOString(),
  });
}
