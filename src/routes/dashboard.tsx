import { createFileRoute, Link } from "@tanstack/react-router";
import { BrainCircuit, CheckCircle2, ClipboardList, FileText, ListTodo, Timer } from "lucide-react";
import { PageShell } from "@/components/site/layout";
import { useCollection, type MeetingSummary, type PlanTask, type Project, type Research } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NorthPilot AI Workspace" },
      { name: "description", content: "See your recent meeting summaries, active tasks, research projects and productivity stats in one place." },
      { property: "og:title", content: "Dashboard — NorthPilot AI Workspace" },
      { property: "og:description", content: "Recent summaries, active tasks, research and quick actions in one workspace." },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { to: "/meetings" as const, label: "Summarize Meeting", icon: FileText },
  { to: "/planner" as const, label: "Create Task Plan", icon: ClipboardList },
  { to: "/research" as const, label: "Start Research", icon: BrainCircuit },
];

function Stat({ icon: Icon, label, value }: { icon: typeof Timer; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-6">
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="font-display text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { items: meetings } = useCollection<MeetingSummary>("meetings");
  const { items: projects } = useCollection<Project>("projects");
  const { items: tasks } = useCollection<PlanTask>("tasks");
  const { items: research } = useCollection<Research>("research");

  const done = tasks.filter((t) => t.status === "done").length;
  const active = tasks.filter((t) => t.status !== "done");
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back 👋</h1>
            <p className="mt-1 text-muted-foreground">Here's what your AI workspace has been working on.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <Button key={q.to} asChild variant={q.to === "/meetings" ? "default" : "outline"}>
                <Link to={q.to}>
                  <q.icon className="size-4" /> {q.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={FileText} label="Meeting summaries" value={meetings.length} />
          <Stat icon={ListTodo} label="Active tasks" value={active.length} />
          <Stat icon={CheckCircle2} label="Tasks completed" value={done} />
          <Stat icon={BrainCircuit} label="Research briefs" value={research.length} />
        </div>

        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Productivity</CardTitle>
            <CardDescription>{completion}% of all planned tasks completed</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={completion} />
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.goal}</p>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No projects yet — <Link to="/planner" className="text-primary underline">create a plan</Link>.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent meeting summaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {meetings.slice(0, 5).map((m) => (
                <div key={m.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{m.result.executiveSummary}</p>
                </div>
              ))}
              {meetings.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No summaries yet — <Link to="/meetings" className="text-primary underline">summarize a meeting</Link>.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {active.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <span className="text-sm">{t.title}</span>
                  <Badge variant="secondary">{t.priority}</Badge>
                </div>
              ))}
              {active.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No active tasks.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Research projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {research.slice(0, 5).map((r) => (
                <div key={r.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{r.topic}</p>
                  <p className="text-xs text-muted-foreground">{r.collection}</p>
                </div>
              ))}
              {research.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No research yet — <Link to="/research" className="text-primary underline">start a brief</Link>.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
