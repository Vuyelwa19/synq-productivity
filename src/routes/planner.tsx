import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Copy, Download, Loader2, Trash2, Wand2 } from "lucide-react";
import { PageShell, AiNotice } from "@/components/site/layout";
import { runAi } from "@/lib/ai.functions";
import { useCollection, uid, download, type PlanTask, type Project } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — NorthPilot" },
      { name: "description", content: "Turn any goal into a phased project plan with subtasks, priorities, estimates and a live task board." },
      { property: "og:title", content: "AI Task Planner — NorthPilot" },
      { property: "og:description", content: "Phased plans, prioritised tasks and a drag-free kanban board powered by AI." },
    ],
  }),
  component: Planner,
});

const COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "doing", label: "In Progress" },
  { key: "done", label: "Completed" },
] as const;

const PRIORITY_STYLES: Record<PlanTask["priority"], string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-accent/20 text-accent-foreground",
  Low: "bg-secondary text-secondary-foreground",
};

function Planner() {
  const ai = useServerFn(runAi);
  const { items: projects, setItems: setProjects } = useCollection<Project>("projects");
  const { items: tasks, setItems: setTasks } = useCollection<PlanTask>("tasks");

  const [form, setForm] = useState({
    name: "",
    goal: "",
    description: "",
    deadline: "",
    priority: "Medium",
    availableTime: "10 hours per week",
    existing: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = useMemo(() => projects.find((p) => p.id === activeId) ?? projects[0] ?? null, [projects, activeId]);
  const projectTasks = useMemo(() => tasks.filter((t) => t.projectId === active?.id), [tasks, active]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.name.trim() || !form.goal.trim()) {
      toast.error("Project name and goal are required");
      return;
    }
    setLoading(true);
    try {
      const r = (await ai({ data: { kind: "plan", payload: form } })) as {
        overview: string;
        phases: { name: string; summary: string }[];
        tasks: Omit<PlanTask, "id" | "status" | "projectId">[];
        schedule: { period: string; focus: string }[];
      };
      const project: Project = {
        id: uid(),
        name: form.name,
        goal: form.goal,
        deadline: form.deadline,
        createdAt: new Date().toISOString(),
        overview: r.overview,
        phases: r.phases ?? [],
        schedule: r.schedule ?? [],
      };
      const newTasks: PlanTask[] = (r.tasks ?? []).map((t) => ({
        ...t,
        subtasks: t.subtasks ?? [],
        id: uid(),
        status: "todo",
        projectId: project.id,
      }));
      setProjects([project, ...projects]);
      setTasks([...newTasks, ...tasks]);
      setActiveId(project.id);
      toast.success("Plan generated and saved");
    } catch (e) {
      toast.error("Could not create the plan", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const move = (id: string, dir: -1 | 1) => {
    const order: PlanTask["status"][] = ["todo", "doing", "done"];
    setTasks(
      tasks.map((t) => {
        if (t.id !== id) return t;
        const i = Math.min(order.length - 1, Math.max(0, order.indexOf(t.status) + dir));
        return { ...t, status: order[i] ?? t.status };
      }),
    );
  };

  const reorder = (id: string, dir: -1 | 1) => {
    const idx = tasks.findIndex((t) => t.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= tasks.length) return;
    const next = [...tasks];
    const a = next[idx]!;
    const b = next[target]!;
    next[idx] = b;
    next[target] = a;
    setTasks(next);
  };


  const planText = active
    ? [
        `${active.name}`,
        `Goal: ${active.goal}`,
        "",
        active.overview,
        "",
        "PHASES",
        ...active.phases.map((p) => `• ${p.name}: ${p.summary}`),
        "",
        "TASKS",
        ...projectTasks.map((t) => `• [${t.priority}] ${t.title} — due ${t.dueDate} (${t.estimate})`),
        "",
        "SCHEDULE",
        ...active.schedule.map((s) => `• ${s.period}: ${s.focus}`),
      ].join("\n")
    : "";

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Badge variant="secondary" className="mb-3">AI Task Planner</Badge>
        <h1 className="text-3xl font-bold">From goal to schedule in one step</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Describe the project and the AI builds phases, tasks, subtasks, priorities and a working board.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Project brief</CardTitle>
              <CardDescription>The more context, the sharper the plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pn">Project name</Label>
                <Input id="pn" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Launch beta website" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pg">Goal</Label>
                <Input id="pg" value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="Ship a public beta with 50 signups" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pd">Description</Label>
                <Textarea id="pd" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Context, constraints, who is involved…" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pdl">Deadline</Label>
                  <Input id="pdl" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pt">Available time</Label>
                <Input id="pt" value={form.availableTime} onChange={(e) => set("availableTime", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pe">Existing tasks (optional)</Label>
                <Textarea id="pe" rows={3} value={form.existing} onChange={(e) => set("existing", e.target.value)} placeholder="One per line" />
              </div>
              <Button onClick={generate} disabled={loading} className="w-full">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                {loading ? "Planning…" : "Generate plan"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {loading && (
              <Card>
                <CardContent className="space-y-3 pt-6">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-20 w-full" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" />
                  </div>
                  <p className="text-sm text-muted-foreground">Breaking your goal into tasks…</p>
                </CardContent>
              </Card>
            )}

            {!loading && !active && (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  Your project plan and task board will appear here.
                </CardContent>
              </Card>
            )}

            {!loading && active && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle>{active.name}</CardTitle>
                        <CardDescription>{active.goal}{active.deadline ? ` · due ${active.deadline}` : ""}</CardDescription>
                      </div>
                      {projects.length > 1 && (
                        <Select value={active.id} onValueChange={setActiveId}>
                          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <AiNotice />
                    <p className="text-sm">{active.overview}</p>
                    {active.phases.length > 0 && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {active.phases.map((p, i) => (
                          <div key={i} className="rounded-lg border border-border p-3">
                            <p className="text-sm font-semibold">{p.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{p.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {active.schedule.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Suggested schedule</h3>
                        <ul className="mt-2 space-y-1.5 text-sm">
                          {active.schedule.map((s, i) => (
                            <li key={i}><span className="font-medium">{s.period}:</span> {s.focus}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                      <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(planText); toast.success("Copied"); }}>
                        <Copy className="size-4" /> Copy plan
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => download(`${active.name.replace(/\s+/g, "-")}-plan.txt`, planText)}>
                        <Download className="size-4" /> Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProjects(projects.filter((p) => p.id !== active.id));
                          setTasks(tasks.filter((t) => t.projectId !== active.id));
                          setActiveId(null);
                          toast.success("Project deleted");
                        }}
                      >
                        <Trash2 className="size-4" /> Delete project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  {COLUMNS.map((col) => (
                    <div key={col.key} className="surface p-3">
                      <div className="mb-3 flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold">{col.label}</h3>
                        <Badge variant="secondary">{projectTasks.filter((t) => t.status === col.key).length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {projectTasks.filter((t) => t.status === col.key).map((t) => (
                          <div key={t.id} className="rounded-lg border border-border bg-background p-3">
                            <input
                              className="w-full bg-transparent text-sm font-medium outline-none focus:underline"
                              value={t.title}
                              aria-label="Task title"
                              onChange={(e) => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, title: e.target.value } : x)))}
                            />
                            {t.subtasks?.length > 0 && (
                              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                {t.subtasks.map((s, i) => <li key={i}>– {s}</li>)}
                              </ul>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                              <span className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY_STYLES[t.priority] ?? PRIORITY_STYLES.Medium}`}>{t.priority}</span>
                              {t.dueDate && <span className="text-muted-foreground">{t.dueDate}</span>}
                              {t.estimate && <span className="text-muted-foreground">· {t.estimate}</span>}
                            </div>
                            {t.dependsOn && <p className="mt-1 text-[11px] text-muted-foreground">Depends on: {t.dependsOn}</p>}
                            <div className="mt-2 flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="size-7" aria-label="Move left" onClick={() => move(t.id, -1)}>
                                <ChevronLeft className="size-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="size-7" aria-label="Move right" onClick={() => move(t.id, 1)}>
                                <ChevronRight className="size-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => reorder(t.id, -1)}>Up</Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => reorder(t.id, 1)}>Down</Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="ml-auto size-7"
                                aria-label="Delete task"
                                onClick={() => { setTasks(tasks.filter((x) => x.id !== t.id)); toast.success("Task deleted"); }}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {projectTasks.filter((t) => t.status === col.key).length === 0 && (
                          <p className="px-1 py-6 text-center text-xs text-muted-foreground">Nothing here yet</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
