# VELA

> You run everything. Vela runs admin.

VELA is an AI operations copilot for executive assistants, operations managers,
operations assistants, and virtual assistants — the people who run everything.
It unifies email, calendar, tasks, contacts and docs, learns how the
principal/team operates, and autonomously handles the repetitive admin layer so
operators can focus on high-judgment work.

This repository contains a **production-grade scaffold** of the product: the
landing page, the full dashboard, an AI service layer wired to the Anthropic
Claude API, a Prisma schema modelling every entity in the product spec, seed
data for a realistic demo workspace, and a reusable component library.

## Tech stack

- **Frontend**: Next.js 14 (App Router), TypeScript (strict), Tailwind CSS,
  shadcn/ui-style components, Framer Motion, Zustand, TanStack Query
- **Backend**: Next.js server components + route handlers, Prisma (Postgres),
  BullMQ (Redis), Anthropic Claude API
- **Integrations**: Nylas (Gmail/Outlook/Calendar), Slack, Zoom, Google Drive,
  Notion, Twilio (SMS/WhatsApp)

## Monorepo layout

```
vela/
├── apps/
│   └── web/              # Next.js 14 app (landing + dashboard + AI)
├── packages/
│   └── database/         # Prisma schema + seed
├── package.json          # pnpm workspaces root
└── pnpm-workspace.yaml
```

## Getting started

```bash
pnpm install
cp .env.example .env

# (optional) bring up Postgres + Redis, then:
pnpm db:push
pnpm db:seed

pnpm dev
# → http://localhost:3000
```

Vela runs end-to-end in **mock mode** without any external services — the demo
workspace is seeded entirely in memory. Set `NEXT_PUBLIC_MOCK_MODE=false` and
provide credentials once you want to hit real APIs.

## What's in here

See the original product spec for the full vision. This repo implements:

- Landing page with animated headline, feature grid, pricing, and CTAs
- 4-step onboarding flow (role → principal → integration → workflow)
- Dashboard shell with sidebar, top bar, and right context panel
- **Inbox** — triaged threads with Claude-generated summaries, urgency scoring,
  suggested actions, and tone-selectable draft replies
- **Calendar** — week view, NLP scheduling bar, meeting prep packs
- **Tasks** — kanban + list, natural-language quick-add, AI subtask generation
- **Meetings** — prep pack generator, live notes, action-item extraction
- **Contacts** — relationship briefs with communication tips
- **Documents** — template library and AI-generated briefings / itineraries
- **Automations** — builder + 4 pre-built playbooks
- **Integrations** — connect/disconnect panels for 8 providers
- **Settings** — profile, principals, autonomy level, notifications, billing
- **Ask Vela** — streaming chat with tool calls (search_emails, create_task,
  schedule_meeting, draft_email, get_contact, create_document, run_automation)

## License

Proprietary — all rights reserved.
