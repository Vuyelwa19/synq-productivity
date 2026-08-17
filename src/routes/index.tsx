import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ClipboardList,
  FileText,
  Gauge,
  Lock,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/site/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NorthPilot — AI Meeting Notes, Task Plans & Research" },
      {
        name: "description",
        content:
          "Turn meeting notes into summaries, goals into task plans, and questions into structured research — in one clean AI workspace.",
      },
      { property: "og:title", content: "NorthPilot — Work Smarter. Plan Better. Research Faster." },
      {
        property: "og:description",
        content: "One AI workspace for meeting summaries, project plans and research briefs.",
      },
    ],
  }),
  component: Landing,
});

const TOOLS = [
  {
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Paste or upload notes and get an executive summary, decisions, owners and deadlines.",
    to: "/meetings" as const,
  },
  {
    icon: ClipboardList,
    title: "AI Task Planner",
    desc: "Turn a goal into a phased plan with subtasks, priorities, estimates and a live task board.",
    to: "/planner" as const,
  },
  {
    icon: BrainCircuit,
    title: "AI Research Assistant",
    desc: "Ask a question and get findings, concepts, evidence, starting sources and next steps.",
    to: "/research" as const,
  },
];

const BENEFITS = [
  { icon: Zap, title: "Hours back each week", desc: "Skip the manual write-up. Get structured output in seconds." },
  { icon: Gauge, title: "Nothing slips", desc: "Decisions, owners and deadlines are extracted every time." },
  { icon: Lock, title: "Private by default", desc: "Your work stays in your browser; AI keys never touch the client." },
  { icon: Sparkles, title: "One consistent workspace", desc: "Three tools, one dashboard, one mental model." },
];

const STEPS = [
  { n: "01", t: "Bring your input", d: "Paste notes, upload a file, or describe a goal or research question." },
  { n: "02", t: "Let the AI structure it", d: "NorthPilot organises everything into clear, labelled sections." },
  { n: "03", t: "Edit, save, export", d: "Refine the result, keep it in your dashboard, copy or download it." },
];

const TESTIMONIALS = [
  { q: "Our weekly sync write-up went from 40 minutes to about two.", n: "Amara Dlamini", r: "Ops Lead" },
  { q: "The planner broke a vague thesis goal into a schedule I actually followed.", n: "Jonas Meyer", r: "PhD Candidate" },
  { q: "Research briefs give me a structured starting point instead of a blank page.", n: "Priya Nair", r: "Product Manager" },
];

const PLANS = [
  { name: "Starter", price: "Free", desc: "For trying every tool.", features: ["10 AI runs / month", "All three tools", "Local saving", "Copy & download"] },
  { name: "Pro", price: "$14", desc: "For daily professional use.", features: ["Unlimited AI runs", "Longer documents", "Research collections", "Priority processing"], featured: true },
  { name: "Team", price: "$39", desc: "For collaborating teams.", features: ["Everything in Pro", "Shared workspaces", "Team task boards", "Admin controls"] },
];

const FAQS = [
  { q: "Is the AI output always accurate?", a: "No. Everything is clearly labelled as AI-generated and should be reviewed. Research sources are suggested starting points, not verified citations." },
  { q: "Where is my data stored?", a: "Summaries, plans and research are saved locally in your browser, and the architecture is ready to move to a database when you add accounts." },
  { q: "Do I need my own API key?", a: "No. AI requests are handled securely on the server — keys are never exposed in the browser." },
  { q: "Can I upload documents?", a: "Yes. The Meeting Summarizer accepts plain text and markdown files, or you can paste notes directly." },
  { q: "Does it work on mobile?", a: "Yes, every screen is responsive across mobile, tablet and desktop, with light and dark modes." },
];

function Landing() {
  return (
    <PageShell>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <Badge variant="secondary" className="mb-5 gap-1.5">
              <Sparkles className="size-3.5" /> Three AI tools, one workspace
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Work Smarter. <span className="text-gradient">Plan Better.</span> Research Faster.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              NorthPilot summarizes your meetings, turns goals into actionable plans, and builds
              structured research briefs — so you spend your time deciding, not documenting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/dashboard">
                  Get Started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/meetings">Try the summarizer</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No account needed to explore. AI output is always labelled.</p>
          </div>

          <div className="grid gap-4 self-center">
            {TOOLS.map((t) => (
              <Link key={t.title} to={t.to} className="surface flex gap-4 p-5 transition-transform hover:-translate-y-0.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <t.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display font-semibold">{t.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">Everything you need to stay ahead</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Purpose-built tools that share one design language, one dashboard and one workflow.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Card key={t.title} className="h-full">
              <CardHeader>
                <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="size-5" />
                </span>
                <CardTitle className="mt-3">{t.title}</CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="px-0">
                  <Link to={t.to}>
                    Open tool <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold">Why teams choose NorthPilot</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title}>
                <b.icon className="size-6 text-primary" />
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="surface p-6">
              <span className="font-display text-sm font-bold text-primary">{s.n}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold">Loved by busy people</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.n}>
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm">“{t.q}”</p>
                  <p className="mt-4 text-sm font-semibold">{t.n}</p>
                  <p className="text-xs text-muted-foreground">{t.r}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20">
        <h2 className="text-3xl font-bold">Simple pricing</h2>
        <p className="mt-2 text-muted-foreground">Start free. Upgrade when the AI becomes part of your routine.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card key={p.name} className={p.featured ? "border-primary shadow-[var(--shadow-lift)]" : ""}>
              <CardHeader>
                {p.featured && <Badge className="mb-2 w-fit">Most popular</Badge>}
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
                <p className="pt-2 font-display text-3xl font-bold">
                  {p.price}
                  {p.price !== "Free" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={p.featured ? "default" : "outline"}>
                  <Link to="/dashboard">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-border bg-card/50">
        <div className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 py-20">
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PageShell>
  );
}
