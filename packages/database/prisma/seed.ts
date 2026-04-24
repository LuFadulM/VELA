/**
 * Vela seed — realistic demo workspace for
 * "Sarah Chen, EA to Marcus Webb (CEO)".
 *
 * Creates: 1 user, 1 workspace, 1 principal, 3 integrations,
 * 15 email threads (AI-analyzed), 8 meetings, 20 tasks,
 * 12 contacts, 3 automations, 5 documents.
 *
 * Safe to re-run — idempotent via `upsert` where the spec allows.
 */
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Vela demo workspace…");

  // --- identity --------------------------------------------------------------
  const user = await prisma.user.upsert({
    where: { email: "sarah@vela.demo" },
    update: {},
    create: {
      email: "sarah@vela.demo",
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=47",
      profile: {
        create: {
          role: "EA",
          communicationStyle: "DIRECT",
          timezone: "America/New_York",
          principalName: "Marcus Webb",
          principalRole: "CEO",
          principalEmail: "marcus@northwind.co",
          workingHours: { start: "08:00", end: "18:00", days: [1, 2, 3, 4, 5] },
          preferences: { autoApprove: ["archive", "summarize"], tone: "professional" },
        },
      },
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: "northwind" },
    update: {},
    create: {
      name: "Northwind — Office of the CEO",
      slug: "northwind",
      plan: "PRO",
      settings: { defaultAutonomy: "suggest" },
      members: { create: { userId: user.id, role: "owner" } },
    },
  });

  const principal = await prisma.principal.create({
    data: {
      workspaceId: workspace.id,
      name: "Marcus Webb",
      role: "CEO, Northwind",
      email: "marcus@northwind.co",
      phone: "+1 415 555 0142",
      preferences: {
        meetingStyle: "brief_and_agenda_driven",
        emailTone: "direct",
        travelClass: "business",
        dietary: "no shellfish",
      },
      relationshipContext: {
        board: ["Deena Park", "Ravi Sethi"],
        directs: ["Aisha Patel (COO)", "Tom Vega (CFO)", "Priya Shah (VP Eng)"],
      },
    },
  });

  // --- integrations ----------------------------------------------------------
  await prisma.integration.createMany({
    data: [
      { workspaceId: workspace.id, provider: "GMAIL", scopes: ["read", "send"], metadata: { account: "sarah@northwind.co" } },
      { workspaceId: workspace.id, provider: "GOOGLE_CALENDAR", scopes: ["events"], metadata: { account: "sarah@northwind.co" } },
      { workspaceId: workspace.id, provider: "SLACK", scopes: ["chat:write", "channels:read"], metadata: { team: "Northwind" } },
    ],
  });

  // --- contacts --------------------------------------------------------------
  const contactSeeds: Array<Omit<Prisma.ContactCreateManyInput, "workspaceId">> = [
    { name: "Aisha Patel", email: "aisha@northwind.co", company: "Northwind", role: "COO", relationshipStrength: "STRONG", interactionCount: 142, tags: ["internal", "exec"] },
    { name: "Tom Vega", email: "tom@northwind.co", company: "Northwind", role: "CFO", relationshipStrength: "STRONG", interactionCount: 98, tags: ["internal", "exec"] },
    { name: "Priya Shah", email: "priya@northwind.co", company: "Northwind", role: "VP Engineering", relationshipStrength: "STRONG", interactionCount: 64, tags: ["internal"] },
    { name: "Deena Park", email: "dpark@harbor.vc", company: "Harbor Ventures", role: "Partner", relationshipStrength: "STRONG", interactionCount: 37, tags: ["board", "vip"] },
    { name: "Ravi Sethi", email: "ravi@meridian.capital", company: "Meridian Capital", role: "Board Member", relationshipStrength: "STRONG", interactionCount: 28, tags: ["board", "vip"] },
    { name: "Jordan Meyer", email: "jordan@acmeco.com", company: "AcmeCo", role: "Head of Partnerships", relationshipStrength: "MEDIUM", interactionCount: 11, tags: ["partner"] },
    { name: "Lena Okafor", email: "lena@bluestone.law", company: "Bluestone LLP", role: "Counsel", relationshipStrength: "MEDIUM", interactionCount: 19, tags: ["legal"] },
    { name: "Diego Ramos", email: "d.ramos@summitpr.com", company: "Summit PR", role: "Principal", relationshipStrength: "MEDIUM", interactionCount: 8, tags: ["pr"] },
    { name: "Keiko Tanaka", email: "keiko@orionlabs.jp", company: "Orion Labs", role: "CEO", relationshipStrength: "WEAK", interactionCount: 3, tags: ["prospect"] },
    { name: "Noah Bennett", email: "noah@forge.ai", company: "Forge AI", role: "Founder", relationshipStrength: "WEAK", interactionCount: 2, tags: ["prospect"] },
    { name: "Miles Grant", email: "miles@northwind.co", company: "Northwind", role: "Chief of Staff", relationshipStrength: "STRONG", interactionCount: 210, tags: ["internal"] },
    { name: "Hana Kim", email: "hana@northwind.co", company: "Northwind", role: "People Ops", relationshipStrength: "MEDIUM", interactionCount: 55, tags: ["internal", "hr"] },
  ];

  const contacts = await Promise.all(
    contactSeeds.map((c) =>
      prisma.contact.create({
        data: {
          ...c,
          workspaceId: workspace.id,
          lastContactDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000),
          aiContext: { preferredChannel: "email", nextTouchpoint: null },
        },
      }),
    ),
  );

  await prisma.principalContact.createMany({
    data: contacts.slice(0, 6).map((c) => ({ principalId: principal.id, contactId: c.id })),
  });

  // --- email threads (AI-analyzed) ------------------------------------------
  const now = Date.now();
  const emailSeeds = [
    { subject: "Re: Q3 board pre-read — urgent", from: "Deena Park", urgency: 9, action: "reply", summary: "Deena needs the Q3 board pre-read by Friday 5pm; she's flagged two slides (traction + runway) for Marcus's review." },
    { subject: "Reschedule request — Orion partnership", from: "Keiko Tanaka", urgency: 7, action: "schedule", summary: "Keiko (Orion CEO) requests moving Thursday 3pm to next week; proposes Tue–Wed AM JST." },
    { subject: "Expense report — March travel", from: "Hana Kim", urgency: 5, action: "delegate", summary: "Hana is waiting on receipt approvals for $4,210 in March travel; needs Marcus's sign-off." },
    { subject: "Dinner Tuesday? — Deena", from: "Deena Park", urgency: 6, action: "schedule", summary: "Deena proposing dinner Tuesday 7pm at Bistro Noelle; wants to discuss board offsite agenda." },
    { subject: "Re: Harbor follow-up docs", from: "Deena Park", urgency: 8, action: "reply", summary: "Harbor needs updated cap table + ARR bridge before Friday board meeting." },
    { subject: "Offsite logistics — June 10–12", from: "Miles Grant", urgency: 7, action: "reply", summary: "Miles needs venue decision (Napa vs. Mendocino) and confirmed attendee list by Wed." },
    { subject: "Press inquiry — TechCrunch Series B", from: "Diego Ramos", urgency: 6, action: "reply", summary: "TC reporter requesting interview for Series B coverage; Diego recommends Thursday slot." },
    { subject: "FYI: New AI partnership opportunity", from: "Noah Bennett", urgency: 3, action: "fyi", summary: "Forge AI founder intro via Ravi — exploring OEM partnership, no time pressure." },
    { subject: "Re: Legal review — Orion MSA", from: "Lena Okafor", urgency: 7, action: "reply", summary: "Bluestone flagged 3 clauses in the Orion MSA (IP assignment, indemnity cap, termination)." },
    { subject: "Your AcmeCo renewal — proposal attached", from: "Jordan Meyer", urgency: 5, action: "reply", summary: "AcmeCo sent $1.2M renewal proposal; wants call this week to walk through pricing tiers." },
    { subject: "Daily brief — Tuesday", from: "Vela", urgency: 4, action: "fyi", summary: "3 meetings today, 2 urgent emails, 4 overdue tasks. Priority: Q3 pre-read due Friday." },
    { subject: "Please approve: new hire offer — Senior PM", from: "Priya Shah", urgency: 8, action: "reply", summary: "Priya needs Marcus's approval on Sr PM offer ($205k base + 0.15%); candidate has competing offer." },
    { subject: "Calendar conflict — Thursday 10am", from: "Miles Grant", urgency: 7, action: "schedule", summary: "Conflict between exec sync and investor call; Miles asks which to reschedule." },
    { subject: "Birthday reminder — Tom Vega (tomorrow)", from: "Vela", urgency: 4, action: "fyi", summary: "CFO Tom Vega's birthday is tomorrow; suggest card + coffee drop-off." },
    { subject: "Re: Speaking slot at SaaStr — confirmed", from: "Diego Ramos", urgency: 5, action: "fyi", summary: "Marcus confirmed for SaaStr fireside; prep pack due 2 weeks prior." },
  ] as const;

  for (let i = 0; i < emailSeeds.length; i++) {
    const e = emailSeeds[i]!;
    await prisma.emailThread.create({
      data: {
        workspaceId: workspace.id,
        principalId: principal.id,
        externalId: `gmail-${i}-${Date.now()}`,
        subject: e.subject,
        participants: [{ name: e.from, email: `${e.from.toLowerCase().replace(/\s/g, ".")}@example.com` }],
        lastMessageAt: new Date(now - i * 3600_000),
        messageCount: 1 + (i % 4),
        urgencyScore: e.urgency,
        isRead: i > 5,
        aiSummary: e.summary,
        aiActionItems: [{ label: e.action, confidence: "high" }],
        tags: [e.action],
        provider: "GMAIL",
      },
    });
  }

  // --- meetings --------------------------------------------------------------
  const day = 86400_000;
  const meetingSeeds = [
    { title: "Exec sync", offsetDays: 0, hour: 9, duration: 60, attendees: ["Aisha Patel", "Tom Vega", "Priya Shah"], hasPack: true },
    { title: "1:1 — Priya Shah", offsetDays: 0, hour: 14, duration: 30, attendees: ["Priya Shah"], hasPack: true },
    { title: "Board pre-read review", offsetDays: 1, hour: 10, duration: 45, attendees: ["Deena Park", "Ravi Sethi"], hasPack: false },
    { title: "Orion Labs — partnership deep dive", offsetDays: 2, hour: 15, duration: 60, attendees: ["Keiko Tanaka"], hasPack: true },
    { title: "AcmeCo renewal call", offsetDays: 3, hour: 11, duration: 30, attendees: ["Jordan Meyer"], hasPack: false },
    { title: "Board meeting — Q3", offsetDays: 4, hour: 9, duration: 180, attendees: ["Deena Park", "Ravi Sethi", "Aisha Patel", "Tom Vega"], hasPack: true },
    { title: "Offsite planning sync", offsetDays: 7, hour: 13, duration: 45, attendees: ["Miles Grant", "Hana Kim"], hasPack: false },
    { title: "TechCrunch fireside", offsetDays: 9, hour: 16, duration: 30, attendees: ["Diego Ramos"], hasPack: false },
  ];

  for (const m of meetingSeeds) {
    const start = new Date(now + m.offsetDays * day);
    start.setHours(m.hour, 0, 0, 0);
    const end = new Date(start.getTime() + m.duration * 60_000);
    await prisma.meeting.create({
      data: {
        workspaceId: workspace.id,
        principalId: principal.id,
        title: m.title,
        startTime: start,
        endTime: end,
        timezone: "America/New_York",
        videoLink: "https://zoom.us/j/demo",
        attendees: m.attendees.map((name) => ({ name, email: `${name.toLowerCase().replace(/\s/g, ".")}@example.com` })),
        prepPackGenerated: m.hasPack,
        agenda: m.hasPack
          ? [
              { item: "Context / updates", durationMin: 10 },
              { item: "Key decisions", durationMin: 20 },
              { item: "Next steps & owners", durationMin: 10 },
            ]
          : undefined,
      },
    });
  }

  // --- tasks ----------------------------------------------------------------
  const taskSeeds = [
    { title: "Finalize Q3 board pre-read", priority: "URGENT", status: "IN_PROGRESS", source: "EMAIL", offsetDays: 3 },
    { title: "Send AcmeCo counter-proposal", priority: "HIGH", status: "TODO", source: "EMAIL", offsetDays: 2 },
    { title: "Confirm offsite venue (Napa vs. Mendocino)", priority: "HIGH", status: "WAITING", source: "EMAIL", offsetDays: 1 },
    { title: "Approve Senior PM offer for Priya", priority: "URGENT", status: "TODO", source: "EMAIL", offsetDays: 0 },
    { title: "Review Orion MSA legal flags", priority: "HIGH", status: "TODO", source: "EMAIL", offsetDays: 2 },
    { title: "Reschedule Thursday 10am conflict", priority: "HIGH", status: "TODO", source: "EMAIL", offsetDays: 0 },
    { title: "Draft SaaStr fireside talking points", priority: "MEDIUM", status: "TODO", source: "MANUAL", offsetDays: 10 },
    { title: "Book dinner — Deena Tuesday 7pm", priority: "MEDIUM", status: "DONE", source: "EMAIL", offsetDays: -1 },
    { title: "Update cap table for Harbor", priority: "URGENT", status: "IN_PROGRESS", source: "EMAIL", offsetDays: 2 },
    { title: "Send Tom Vega birthday card", priority: "LOW", status: "TODO", source: "AI", offsetDays: 1 },
    { title: "Prep Q3 traction slides", priority: "HIGH", status: "IN_PROGRESS", source: "MEETING", offsetDays: 3 },
    { title: "Expense approvals — March travel", priority: "MEDIUM", status: "WAITING", source: "EMAIL", offsetDays: 1 },
    { title: "Onboard new office manager", priority: "MEDIUM", status: "TODO", source: "MANUAL", offsetDays: 7 },
    { title: "Renew DocuSign enterprise", priority: "LOW", status: "TODO", source: "MANUAL", offsetDays: 14 },
    { title: "Schedule 1:1s for Q3", priority: "MEDIUM", status: "IN_PROGRESS", source: "MANUAL", offsetDays: 5 },
    { title: "Finalize speaker bio for SaaStr", priority: "LOW", status: "TODO", source: "AI", offsetDays: 12 },
    { title: "Reply to Forge AI intro (Ravi)", priority: "LOW", status: "TODO", source: "EMAIL", offsetDays: 5 },
    { title: "Follow up on press inquiry", priority: "MEDIUM", status: "TODO", source: "EMAIL", offsetDays: 2 },
    { title: "Compile weekly briefing doc", priority: "LOW", status: "DONE", source: "AI", offsetDays: -2 },
    { title: "Order flowers for Deena (anniversary)", priority: "LOW", status: "DONE", source: "AI", offsetDays: -3 },
  ] as const;

  for (const t of taskSeeds) {
    await prisma.task.create({
      data: {
        workspaceId: workspace.id,
        principalId: principal.id,
        assigneeId: user.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        sourceType: t.source,
        dueDate: new Date(now + t.offsetDays * day),
        tags: [],
        aiGenerated: t.source === "AI",
      },
    });
  }

  // --- automations ----------------------------------------------------------
  const automations: Prisma.AutomationCreateManyInput[] = [
    {
      workspaceId: workspace.id,
      name: "New Meeting Booked",
      description: "Generate prep pack → reminder 30m before → capture notes → send follow-up",
      trigger: { type: "calendar.event_created" },
      actions: [
        { type: "generate_prep_pack" },
        { type: "schedule_notification", offsetMinutes: -30 },
        { type: "create_notes_doc", at: "meeting_start" },
        { type: "draft_followup", at: "meeting_end" },
      ],
      runCount: 12,
      lastRunAt: new Date(now - 2 * 3600_000),
    },
    {
      workspaceId: workspace.id,
      name: "VIP Email Received",
      description: "Flag urgency → draft reply → create task if action required",
      trigger: { type: "email.received", filter: { tag: "vip" } },
      actions: [
        { type: "set_urgency", level: "high" },
        { type: "draft_reply", tone: "professional" },
        { type: "create_task_if_actionable" },
      ],
      runCount: 48,
      lastRunAt: new Date(now - 40 * 60_000),
    },
    {
      workspaceId: workspace.id,
      name: "Weekly Ops Briefing",
      description: "Every Monday 8am — compile tasks, meetings, emails → briefing doc",
      trigger: { type: "schedule", cron: "0 8 * * 1" },
      actions: [{ type: "generate_briefing" }, { type: "send_to_principal" }],
      runCount: 6,
      lastRunAt: new Date(now - 3 * day),
    },
  ];
  await prisma.automation.createMany({ data: automations });

  // --- documents ------------------------------------------------------------
  const documents: Prisma.DocumentCreateManyInput[] = [
    {
      workspaceId: workspace.id,
      createdById: user.id,
      title: "Q3 Board Pre-Read",
      type: "BRIEF",
      content: "# Q3 Board Pre-Read\n\n## Traction\n- ARR: $18.4M (+34% YoY)\n- NRR: 124%\n- Logo churn: 1.1%\n\n## Runway\n- 22 months at current burn\n- Q4 hiring plan: +8 roles\n\n## Key decisions\n1. Series B timing\n2. Europe expansion\n3. Partnership strategy",
    },
    {
      workspaceId: workspace.id,
      createdById: user.id,
      title: "Weekly Ops Briefing — Apr 21",
      type: "REPORT",
      content: "# This week at a glance\n\n**Top priority:** Q3 board pre-read (Friday).\n\n## Meetings\n- Mon: Exec sync, 1:1 Priya\n- Tue: Board pre-read review\n- Wed: Orion partnership\n- Thu: AcmeCo renewal\n- Fri: Board meeting\n\n## Urgent\n- Approve Sr PM offer\n- Resolve Thursday 10am conflict",
    },
    {
      workspaceId: workspace.id,
      createdById: user.id,
      title: "Meeting Notes Template",
      type: "TEMPLATE",
      isTemplate: true,
      content: "# {{title}}\n\n**Date:** {{date}}\n**Attendees:** {{attendees}}\n\n## Context\n\n## Discussion\n\n## Decisions\n\n## Action items\n- [ ] ",
    },
    {
      workspaceId: workspace.id,
      createdById: user.id,
      title: "SaaStr Fireside — Talking Points",
      type: "BRIEF",
      content: "# SaaStr Fireside Prep\n\n## Key narratives\n1. Founder journey\n2. Product-led growth lessons\n3. AI in ops\n\n## Tough questions\n- Competitive moat vs. incumbents?\n- Burn multiple justification?",
    },
    {
      workspaceId: workspace.id,
      createdById: user.id,
      title: "Offsite Itinerary — June 10–12",
      type: "ITINERARY",
      content: "# Executive Offsite — Napa\n\n## Day 1 — Thursday\n- 15:00 Arrivals\n- 18:00 Welcome dinner @ Bistro Don Giovanni\n\n## Day 2 — Friday\n- 09:00 Strategy session\n- 12:30 Lunch\n- 14:00 Product deep dive\n- 19:00 Group dinner\n\n## Day 3 — Saturday\n- 09:00 Wrap-up & commitments\n- 12:00 Departures",
    },
  ];
  await prisma.document.createMany({ data: documents });

  // --- notifications --------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      { userId: user.id, type: "urgent_email", title: "Urgent email from Deena Park", body: "Re: Q3 board pre-read — urgent", isRead: false },
      { userId: user.id, type: "meeting_starting", title: "Exec sync in 15 minutes", body: "Prep pack is ready.", isRead: false },
      { userId: user.id, type: "task_overdue", title: "Task overdue: Approve Senior PM offer", body: "Draft reply ready.", isRead: false },
      { userId: user.id, type: "automation_ran", title: "Automation ran: Weekly Ops Briefing", body: "Generated briefing for this week.", isRead: true },
    ],
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
