import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Inbox,
  CalendarClock,
  ListChecks,
  Users,
  Zap,
  Shield,
  Brain,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { ProductPreview } from "@/components/landing/product-preview";

const FEATURES = [
  {
    icon: Inbox,
    title: "Smart Inbox",
    body:
      "Unified view across Gmail and Outlook. Every thread ranked by urgency, summarized in three bullets, and primed with a reply in your voice.",
  },
  {
    icon: CalendarClock,
    title: "Calendar Intelligence",
    body:
      "Natural-language scheduling. Conflict detection. Auto-generated prep packs with attendee context and agendas the moment a meeting lands.",
  },
  {
    icon: ListChecks,
    title: "Task extraction",
    body:
      "Tasks fall out of emails and meeting notes automatically. Priorities set, owners identified, follow-ups drafted.",
  },
  {
    icon: Users,
    title: "Relationship memory",
    body:
      "Know what each contact said last, how they prefer to communicate, and what matters to them — before you hit reply.",
  },
  {
    icon: Zap,
    title: "Automations",
    body:
      "Playbooks like 'VIP email received → draft reply + task' and 'Monday 8am → weekly briefing doc'. Build your own in minutes.",
  },
  {
    icon: Brain,
    title: "Ask Vela anything",
    body:
      "\"Find time with Deena next week, mention the offsite.\" Vela reads your calendar, drafts the email, waits for your thumbs-up.",
  },
];

const WORKFLOWS = [
  { title: "Email triage", bullets: ["Urgency scoring", "Tone-matched drafts", "Bulk actions"] },
  { title: "Scheduling", bullets: ["Natural-language requests", "Multi-zone awareness", "Auto prep packs"] },
  { title: "Task tracking", bullets: ["Extracted from email + meetings", "Smart subtasks", "Drafted follow-ups"] },
  { title: "Briefings", bullets: ["Daily & weekly rhythm", "Principal-ready", "Distribution built-in"] },
];

const PRICES = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "For trying Vela.",
    features: [
      "1 connected inbox",
      "50 AI actions / month",
      "Community support",
      "All core modules",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$39",
    period: "per operator / month",
    tagline: "For serious EAs, OMs, and VAs.",
    features: [
      "Unlimited integrations",
      "Unlimited AI actions",
      "Automations + playbooks",
      "Priority support",
      "Meeting prep packs",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Teams",
    price: "$79",
    period: "per operator / month",
    tagline: "For ops teams supporting execs.",
    features: [
      "Everything in Pro",
      "Shared principals & handoffs",
      "Team analytics",
      "SSO + audit logs",
      "Dedicated onboarding",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-navy-100/80 bg-white/80 backdrop-blur">
        <nav className="container flex h-16 items-center justify-between">
          <Link href="/" aria-label="Vela home">
            <Logo />
          </Link>
          <div className="hidden items-center gap-7 text-sm text-navy-600 md:flex">
            <Link href="#features" className="hover:text-navy-900">Features</Link>
            <Link href="#workflows" className="hover:text-navy-900">Workflows</Link>
            <Link href="#pricing" className="hover:text-navy-900">Pricing</Link>
            <Link href="/auth/signin" className="hover:text-navy-900">Sign in</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className="hidden rounded-lg px-3 py-1.5 text-sm font-semibold text-navy-700 hover:bg-navy-100 md:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Start free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
        <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/60 to-transparent blur-3xl" />
        <div className="container py-16 md:py-24 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/70 px-3 py-1 text-xs font-medium text-navy-600 shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Meet Vela — the AI brain behind the best operators
            </div>
            <HeroHeadline />
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-navy-600">
              You run everything. Vela runs admin. One workspace that connects every tool, learns how you operate, and handles the busywork — with you always in control.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-navy-800"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-5 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50"
              >
                See the demo workspace
              </Link>
              <Link
                href="mailto:hello@vela.ai"
                className="inline-flex items-center gap-2 rounded-lg px-2 py-3 text-sm font-semibold text-navy-700 hover:text-navy-900"
              >
                Book a demo →
              </Link>
            </div>
            <p className="mt-4 text-xs text-navy-500">No credit card. Set up in under 2 minutes.</p>
          </div>

          <div className="mt-16">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* social proof */}
      <section className="border-y border-navy-100 bg-navy-50/50 py-8">
        <div className="container">
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-wide text-navy-500">
            Trusted by the people who run everything at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[15px] font-semibold tracking-tight text-navy-400">
            <span>Northwind</span>
            <span>Harbor Ventures</span>
            <span>Orion Labs</span>
            <span>Meridian Capital</span>
            <span>AcmeCo</span>
            <span>Forge AI</span>
            <span>Bluestone LLP</span>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">The workspace</p>
          <h2 className="mt-2 text-balance text-4xl font-bold tracking-tight text-navy-900">
            Every tool that runs your principal's world — in one place, with AI at the center.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-card border border-navy-200 bg-white p-6 shadow-card transition hover:shadow-lift">
              <div className="absolute right-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-indigo-100/60 blur-2xl transition group-hover:bg-indigo-200/60" />
              <div className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-navy-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* workflows */}
      <section id="workflows" className="relative border-t border-navy-100 bg-navy-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 -z-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Operating rhythm</p>
            <h2 className="mt-2 text-balance text-4xl font-bold tracking-tight">
              Built around the four workflows EAs and Ops run every day.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {WORKFLOWS.map((w) => (
              <div key={w.title} className="rounded-card border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="font-semibold">{w.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-navy-200">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-indigo-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Pricing</p>
          <h2 className="mt-2 text-balance text-4xl font-bold tracking-tight text-navy-900">
            Simple pricing. Built to pay for itself in a week.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICES.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-modal p-7 ${
                p.highlight
                  ? "border-2 border-indigo-500 bg-white shadow-lift"
                  : "border border-navy-200 bg-white shadow-card"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <div className="mb-1 text-sm font-semibold text-navy-600">{p.name}</div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-navy-900">{p.price}</span>
                <span className="text-sm text-navy-500">/{p.period}</span>
              </div>
              <p className="mb-5 text-sm text-navy-600">{p.tagline}</p>
              <ul className="mb-6 space-y-2 text-sm text-navy-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-navy-900 text-white hover:bg-navy-800"
                    : "border border-navy-200 bg-white text-navy-900 hover:bg-navy-50"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-modal bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-900 p-10 text-white md:p-16">
          <div className="absolute inset-0 bg-grid opacity-[0.05]" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Your principal hired you for judgment, not busywork.
              </h3>
              <p className="mt-3 max-w-xl text-navy-200">
                Let Vela handle the admin. Free, 14-day trial on Pro. 2-minute setup.
              </p>
            </div>
            <div className="flex flex-wrap justify-start gap-3 md:justify-end">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-navy-900 shadow-lift hover:bg-navy-100"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:hello@vela.ai"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/0 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-navy-100">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-xs text-navy-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span>© {new Date().getFullYear()} Vela, Inc.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> SOC 2 Type II in progress
            </span>
            <Link href="#" className="hover:text-navy-800">Privacy</Link>
            <Link href="#" className="hover:text-navy-800">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
