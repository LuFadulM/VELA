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
data for a realistic demo workspace, and a reusable component library —
**designed to deploy on the Vercel Hobby + Supabase Free tiers**.

## Tech stack

- **Frontend**: Next.js 14 (App Router), TypeScript (strict), Tailwind CSS,
  shadcn/ui-style components, Framer Motion, Zustand, TanStack Query
- **Auth + Realtime**: Supabase Auth (email + Google OAuth), Supabase Realtime
- **Database**: Supabase Postgres via Prisma (pooled connection for Vercel)
- **AI**: Anthropic Claude (`claude-sonnet-4-6` by default, streaming + tool
  use)
- **Hosting**: Vercel (Hobby) — single region, 30s `maxDuration` on the chat
  route, weekly cron for the briefing automation

## Monorepo layout

```
vela/
├── apps/
│   └── web/              # Next.js 14 app (landing + dashboard + AI)
├── packages/
│   └── database/         # Prisma schema + seed
├── vercel.json           # framework, regions, function tuning, cron
├── package.json          # pnpm workspaces root
└── pnpm-workspace.yaml
```

## Local development

```bash
pnpm install
cp .env.example .env
pnpm dev
# → http://localhost:3000
```

Vela runs **end-to-end without any external services** — auth is bypassed,
the AI service layer returns hand-authored responses, and the dashboard is
populated from in-memory mock data. As soon as you fill in
`NEXT_PUBLIC_SUPABASE_URL` / `ANTHROPIC_API_KEY` the corresponding flow
switches to real.

## Deploying to Vercel + Supabase (free tiers)

### 1. Provision Supabase

1. Create a project at <https://supabase.com>. Region near your users
   (the Vercel region is pinned to `iad1` in `vercel.json`; pick a
   Supabase region in the same continent).
2. Copy from **Project → Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
3. Copy from **Project → Settings → Database → Connection string** (URI tab):
   - The **pooled** string (port 6543) → `DATABASE_URL`. Append
     `?pgbouncer=true&connection_limit=1`.
   - The **direct** string (port 5432) → `DIRECT_URL`.

   Vercel functions are short-lived and stateless. The pooler keeps
   you under Supabase's 200-connection cap; `connection_limit=1` per
   serverless invocation completes the picture. The direct URL is for
   `prisma db push` / migrations only.

4. (Optional) **Authentication → Providers → Google** to enable the
   "Continue with Google" button. Supabase walks you through the
   Google Cloud setup; the redirect URL is
   `https://<your-vercel-domain>/auth/callback`.

5. Push the schema:
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed   # seeds the demo workspace
   ```

6. **Realtime → Tables**: enable replication on the `Notification`
   table so the in-app notification feed updates live.

### 2. Configure Anthropic

Grab a key from <https://console.anthropic.com> and set
`ANTHROPIC_API_KEY`. Default model is `claude-sonnet-4-6`; override
with `ANTHROPIC_MODEL` if you'd like.

### 3. Deploy to Vercel

1. Import the repo at <https://vercel.com/new>. Vercel reads
   `vercel.json` and configures the framework, install/build commands,
   region, and cron automatically.
2. Set the environment variables above (Vercel project → Settings →
   Environment Variables). Mark `NEXT_PUBLIC_*` as exposed.
3. Deploy.

### What's tuned for the free tier

- **`vercel.json`**: pins region to `iad1` (no edge fan-out, predictable
  cold starts), sets `maxDuration: 30s` on `/api/chat` for streaming,
  registers the single allowed cron for the weekly briefing
  (`Mon 13:00 UTC`).
- **Prisma**: pooled connection (port 6543) at runtime; direct
  connection only for migrations.
- **Auth middleware**: short-circuits when Supabase isn't configured,
  so demo-mode preview deploys still work.
- **Supabase Realtime**: hooked into the right-hand context panel; the
  hook silently no-ops if the project isn't wired up.

## What's in here

- Landing page with animated headline, feature grid, pricing, and CTAs
- 4-step onboarding flow (role → principal → integration → workflow) +
  Supabase account creation on the final step
- Dashboard shell with sidebar, top bar, and right context panel
- **Inbox** — triaged threads with Claude-generated summaries, urgency
  scoring, suggested actions, tone-selectable draft replies
- **Calendar** — week view, NLP scheduling bar, meeting prep packs
- **Tasks** — kanban + list views, natural-language quick-add, AI
  subtask generation, task detail drawer with follow-up drafter
- **Meetings** — prep pack modal (Agenda / Attendees / Context / Notes)
  with attendee profiles pulled from the contact graph
- **Contacts** — relationship briefs with communication tips
- **Documents** — template library and AI-generated briefings /
  itineraries
- **Automations** — builder + 4 pre-built playbooks (one driven by the
  Vercel cron)
- **Integrations** — connect/disconnect panels for 9 providers
- **Settings** — profile, principals, autonomy level, notifications,
  billing
- **Ask Vela** — streaming chat with tool calls (`search_emails`,
  `create_task`, `schedule_meeting`, `draft_email`, `get_contact`,
  `create_document`, `run_automation`)

## License

Proprietary — all rights reserved.
