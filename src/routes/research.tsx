import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Copy, Download, Loader2, Save, Send, Trash2, Wand2 } from "lucide-react";
import { PageShell, AiNotice } from "@/components/site/layout";
import { runAi } from "@/lib/ai.functions";
import { useCollection, uid, download, type Research } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — NorthPilot" },
      { name: "description", content: "Ask a research question and get findings, key concepts, evidence, starting sources and next steps." },
      { property: "og:title", content: "AI Research Assistant — NorthPilot" },
      { property: "og:description", content: "Structured research briefs with clearly labelled AI content and suggested sources." },
    ],
  }),
  component: ResearchPage,
});

type Result = Research["result"];

function toText(topic: string, r: Result) {
  return [
    `RESEARCH BRIEF: ${topic}`,
    "",
    r.overview,
    "",
    "KEY FINDINGS",
    ...(r.keyFindings ?? []).map((k) => `• ${k}`),
    "",
    "KEY CONCEPTS",
    ...(r.concepts ?? []).map((c) => `• ${c.term}: ${c.definition}`),
    "",
    "SUPPORTING EVIDENCE",
    ...(r.evidence ?? []).map((k) => `• ${k}`),
    "",
    "SUGGESTED SOURCES (unverified starting points)",
    ...(r.sources ?? []).map((s) => `• ${s.title} — ${s.note}`),
    "",
    "OPEN QUESTIONS",
    ...(r.openQuestions ?? []).map((k) => `• ${k}`),
    "",
    "SUMMARY",
    r.summary,
    "",
    "NEXT STEPS",
    ...(r.nextSteps ?? []).map((k) => `• ${k}`),
    "",
    "AI-generated. Verify all facts and sources independently.",
  ].join("\n");
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((i, k) => (
          <li key={k} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResearchPage() {
  const ai = useServerFn(runAi);
  const { items, setItems } = useCollection<Research>("research");
  const [topic, setTopic] = useState("");
  const [collection, setCollection] = useState("General");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [followUps, setFollowUps] = useState<Research["followUps"]>([]);
  const [question, setQuestion] = useState("");

  const collections = useMemo(
    () => Array.from(new Set(items.map((i) => i.collection))).filter(Boolean),
    [items],
  );

  const generate = async () => {
    if (topic.trim().length < 5) {
      toast.error("Enter a research question or topic");
      return;
    }
    setLoading(true);
    setFollowUps([]);
    try {
      const r = (await ai({ data: { kind: "research", payload: { topic, context } } })) as Result;
      setResult(r);
      toast.success("Research brief ready");
    } catch (e) {
      toast.error("Research failed", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const askFollowUp = async () => {
    if (!question.trim() || !result) return;
    setAsking(true);
    try {
      const r = (await ai({
        data: { kind: "followup", payload: { topic, question, brief: result.summary } },
      })) as { answer: string; points: string[] };
      setFollowUps([...followUps, { question, answer: r.answer, points: r.points ?? [] }]);
      setQuestion("");
    } catch (e) {
      toast.error("Could not answer", { description: (e as Error).message });
    } finally {
      setAsking(false);
    }
  };

  const save = () => {
    if (!result) return;
    setItems([
      { id: uid(), topic, collection: collection || "General", createdAt: new Date().toISOString(), result, followUps },
      ...items,
    ]);
    toast.success("Research saved");
  };

  const text = result ? toText(topic, result) : "";

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Badge variant="secondary" className="mb-3">AI Research Assistant</Badge>
        <h1 className="text-3xl font-bold">Start every topic with structure</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ask a question, get a labelled brief, then dig deeper with follow-ups.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Research request</CardTitle>
              <CardDescription>Organise briefs into collections as you go.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="rt">Research question or topic</Label>
                <Textarea id="rt" rows={3} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="How does remote work affect team productivity?" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rc">Context or constraints (optional)</Label>
                <Textarea id="rc" rows={3} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Audience, industry, time period, depth…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rp">Collection</Label>
                <Input id="rp" value={collection} onChange={(e) => setCollection(e.target.value)} list="collections" />
                <datalist id="collections">
                  {collections.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <Button onClick={generate} disabled={loading} className="w-full">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                {loading ? "Researching…" : "Start research"}
              </Button>

              {items.length > 0 && (
                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-sm font-semibold">Saved research</p>
                  {items.slice(0, 8).map((r) => (
                    <div key={r.id} className="flex items-center gap-2">
                      <button
                        onClick={() => { setTopic(r.topic); setCollection(r.collection); setResult(r.result); setFollowUps(r.followUps ?? []); }}
                        className="flex-1 truncate rounded-lg border border-border px-3 py-2 text-left text-xs hover:bg-secondary"
                      >
                        <span className="font-medium">{r.topic}</span>
                        <span className="block text-muted-foreground">{r.collection}</span>
                      </button>
                      <Button size="icon" variant="ghost" className="size-8" aria-label="Delete research" onClick={() => setItems(items.filter((x) => x.id !== r.id))}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {loading && (
              <Card>
                <CardContent className="space-y-3 pt-6">
                  <Skeleton className="h-5 w-52" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <p className="text-sm text-muted-foreground">Gathering findings and structuring the brief…</p>
                </CardContent>
              </Card>
            )}

            {!loading && !result && (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  Your research brief will appear here.
                </CardContent>
              </Card>
            )}

            {!loading && result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{topic}</CardTitle>
                    <CardDescription>{collection} · AI-generated research brief</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-3 rounded-lg border border-accent/40 bg-accent/10 p-3 text-xs">
                      <AlertTriangle className="size-4 shrink-0 text-accent-foreground" />
                      <p>
                        This brief is AI-generated and not fact-checked. Sources listed are suggested
                        starting points — confirm them before citing.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Overview</h3>
                      <p className="mt-2 text-sm">{result.overview}</p>
                    </div>
                    <List title="Key findings" items={result.keyFindings} />
                    {result.concepts?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Important concepts</h3>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {result.concepts.map((c, i) => (
                            <div key={i} className="rounded-lg border border-border p-3 text-sm">
                              <p className="font-medium">{c.term}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{c.definition}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <List title="Supporting evidence" items={result.evidence} />
                    {result.sources?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Suggested sources <span className="normal-case">(unverified)</span>
                        </h3>
                        <ul className="mt-2 space-y-1.5 text-sm">
                          {result.sources.map((s, i) => (
                            <li key={i}>
                              <span className="font-medium">{s.title}</span>
                              <span className="text-muted-foreground"> — {s.note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <List title="Research questions to explore" items={result.openQuestions} />
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Summary</h3>
                      <p className="mt-2 text-sm">{result.summary}</p>
                    </div>
                    <List title="Suggested next steps" items={result.nextSteps} />
                    <AiNotice />

                    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                      <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
                        <Copy className="size-4" /> Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => download(`${topic.slice(0, 40).replace(/\s+/g, "-")}.txt`, text)}>
                        <Download className="size-4" /> Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={save}>
                        <Save className="size-4" /> Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Follow-up questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {followUps.map((f, i) => (
                      <div key={i} className="rounded-lg border border-border p-3">
                        <p className="text-sm font-medium">{f.question}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
                        {f.points?.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {f.points.map((p, k) => <li key={k}>– {p}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && askFollowUp()}
                        placeholder="Ask a follow-up…"
                      />
                      <Button onClick={askFollowUp} disabled={asking}>
                        {asking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
