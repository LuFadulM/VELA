import type { VelaDocument } from "@/types";

const day = 24 * 60 * 60 * 1000;

export const mockDocuments: VelaDocument[] = [
  {
    id: "d_01",
    title: "Q3 Board Pre-Read",
    type: "BRIEF",
    isTemplate: false,
    createdAt: new Date(Date.now() - 3 * day),
    updatedAt: new Date(Date.now() - 2 * 60 * 60_000),
    content: `# Q3 Board Pre-Read

## Traction
- ARR: **$18.4M** (+34% YoY)
- NRR: **124%**
- Logo churn: 1.1%

## Runway
- 22 months at current burn
- Q4 hiring plan: +8 roles

## Key decisions for this meeting
1. Series B timing
2. Europe expansion — H1 vs. H2
3. Orion partnership go/no-go`,
  },
  {
    id: "d_02",
    title: "Weekly Ops Briefing — this week",
    type: "REPORT",
    isTemplate: false,
    createdAt: new Date(Date.now() - 6 * day),
    updatedAt: new Date(Date.now() - 2 * day),
    content: `# This week at a glance

**Top priority:** Q3 board pre-read (Friday).

## Meetings
- Mon — Exec sync · 1:1 Priya
- Tue — Board pre-read review
- Wed — Orion partnership
- Thu — AcmeCo renewal · investor update
- Fri — Board meeting

## Urgent
- Approve Sr PM offer (candidate has competing offer)
- Resolve Thursday 10am conflict

## Waiting on Marcus
- Expense approvals — March
- Offsite venue decision`,
  },
  {
    id: "d_03",
    title: "Meeting Notes Template",
    type: "TEMPLATE",
    isTemplate: true,
    createdAt: new Date(Date.now() - 30 * day),
    updatedAt: new Date(Date.now() - 30 * day),
    content: `# {{title}}

**Date:** {{date}}
**Attendees:** {{attendees}}

## Context

## Discussion

## Decisions

## Action items
- [ ] `,
  },
  {
    id: "d_04",
    title: "SaaStr Fireside — Talking Points",
    type: "BRIEF",
    isTemplate: false,
    createdAt: new Date(Date.now() - 2 * day),
    updatedAt: new Date(Date.now() - 1 * day),
    content: `# SaaStr Fireside Prep

## Key narratives
1. Founder journey — pivots that compounded
2. Product-led growth lessons
3. AI in ops — real use cases, not theater

## Tough questions (prep)
- Competitive moat vs. incumbents?
- Burn multiple justification?
- Why Europe now?

## Stories to land
- The 48h ops rewrite that saved Q1
- Our customer who ran their wedding planner through Vela`,
  },
  {
    id: "d_05",
    title: "Offsite Itinerary — June 10–12",
    type: "ITINERARY",
    isTemplate: false,
    createdAt: new Date(Date.now() - 7 * day),
    updatedAt: new Date(Date.now() - 1 * day),
    content: `# Executive Offsite — Carneros Resort, Napa

## Day 1 — Thursday, Jun 10
- 15:00 Arrivals (Napa Valley Airporter arranged)
- 18:00 Welcome dinner @ Bistro Don Giovanni

## Day 2 — Friday, Jun 11
- 09:00 Strategy session (Sunrise Room)
- 12:30 Lunch on the terrace
- 14:00 Product deep dive
- 19:00 Group dinner @ PRESS

## Day 3 — Saturday, Jun 12
- 09:00 Wrap-up & commitments
- 12:00 Departures`,
  },
];

export function getDocument(id: string): VelaDocument | undefined {
  return mockDocuments.find((d) => d.id === id);
}
