import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Loader2, Pencil, RefreshCw, Save, Upload, Wand2 } from "lucide-react";
import { PageShell, AiNotice } from "@/components/site/layout";
import { runAi } from "@/lib/ai.functions";
import { useCollection, uid, download, type MeetingSummary } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — NorthPilot" },
      { name: "description", content: "Turn raw meeting notes into an executive summary with decisions, action items, owners and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — NorthPilot" },
      { property: "og:description", content: "Executive summaries, decisions, owners and deadlines from any meeting notes." },
    ],
  }),
  component: Meetings,
});

type Result = MeetingSummary["result"];

function toText(title: string, date: string, r: Result) {
  return [
    `${title} — ${date}`,
    "",
    "EXECUTIVE SUMMARY",
    r.executiveSummary,
    "",
    "KEY DISCUSSION POINTS",
    ...r.keyPoints.map((k) => `• ${k}`),
    "",
    "DECISIONS",
    ...r.decisions.map((k) => `• ${k}`),
    "",
    "ACTION ITEMS",
    ...r.actionItems.map((a) => `• ${a.task} — ${a.owner} (due ${a.deadline})`),
    "",
    "FOLLOW-UPS",
    ...r.followUps.map((k) => `• ${k}`),
    "",
    "QUESTIONS / ISSUES RAISED",
    ...r.openQuestions.map((k) => `• ${k}`),
    "",
    "AI-generated. Please verify.",
  ].join("\n");
}

function Section({ title, items }: { title: string; items: string[] }) {
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

function Meetings() {
  const ai = useServerFn(runAi);
  const { items, setItems } = useCollection<MeetingSummary>("meetings");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [length, setLength] = useState("standard");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const generate = async () => {
    if (notes.trim().length < 30) {
      toast.error("Add a bit more detail", { description: "Paste at least a few lines of meeting notes." });
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const r = (await ai({ data: { kind: "meeting", payload: { title, date, length, notes } } })) as Result;
      setResult(r);
      toast.success("Summary ready");
    } catch (e) {
      toast.error("Could not summarize", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setNotes(text.slice(0, 20000));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    toast.success("File loaded");
  };

  const save = () => {
    if (!result) return;
    setItems([{ id: uid(), title: title || "Untitled meeting", date, createdAt: new Date().toISOString(), result }, ...items]);
    toast.success("Saved to your dashboard");
  };

  const text = result ? toText(title || "Untitled meeting", date, result) : "";

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Badge variant="secondary" className="mb-3">Meeting Notes Summarizer</Badge>
        <h1 className="text-3xl font-bold">Turn messy notes into decisions and owners</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Paste or upload notes and get a structured summary you can copy, edit, export or save.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Meeting input</CardTitle>
              <CardDescription>Text and markdown files are supported.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="mt">Meeting title</Label>
                  <Input id="mt" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly product sync" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="md">Date</Label>
                  <Input id="md" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Summary length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mn">Meeting notes</Label>
                <Textarea
                  id="mn"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={12}
                  placeholder="Paste your raw notes or transcript here…"
                />
                <p className="text-xs text-muted-foreground">{notes.length} characters</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={generate} disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                  {loading ? "Summarizing…" : "Generate summary"}
                </Button>
                <Button asChild variant="outline">
                  <label className="cursor-pointer">
                    <Upload className="size-4" /> Upload file
                    <input
                      type="file"
                      accept=".txt,.md,.csv,text/plain"
                      className="sr-only"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {loading && (
              <Card>
                <CardContent className="space-y-3 pt-6">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <p className="text-sm text-muted-foreground">The AI is reading your notes…</p>
                </CardContent>
              </Card>
            )}

            {!loading && !result && (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  Your structured summary will appear here.
                </CardContent>
              </Card>
            )}

            {!loading && result && (
              <Card>
                <CardHeader>
                  <CardTitle>{title || "Untitled meeting"}</CardTitle>
                  <CardDescription>{date} · AI-generated summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AiNotice />
                  {editing ? (
                    <Textarea rows={20} value={draft} onChange={(e) => setDraft(e.target.value)} />
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Executive summary</h3>
                        <p className="mt-2 text-sm">{result.executiveSummary}</p>
                      </div>
                      <Section title="Key discussion points" items={result.keyPoints} />
                      <Section title="Important decisions" items={result.decisions} />
                      {result.actionItems?.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Action items</h3>
                          <div className="mt-2 space-y-2">
                            {result.actionItems.map((a, i) => (
                              <div key={i} className="rounded-lg border border-border p-3 text-sm">
                                <p className="font-medium">{a.task}</p>
                                <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                                  <span>Owner: {a.owner || "Unassigned"}</span>
                                  <span>Deadline: {a.deadline || "Not set"}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <Section title="Follow-up items" items={result.followUps} />
                      <Section title="Questions & issues raised" items={result.openQuestions} />
                    </>
                  )}

                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(editing ? draft : text); toast.success("Copied"); }}>
                      <Copy className="size-4" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setDraft(text); setEditing(!editing); }}>
                      <Pencil className="size-4" /> {editing ? "Done editing" : "Edit"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => download(`${(title || "meeting").replace(/\s+/g, "-")}.txt`, editing ? draft : text)}>
                      <Download className="size-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={save}>
                      <Save className="size-4" /> Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={generate}>
                      <RefreshCw className="size-4" /> Generate again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Saved summaries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setTitle(m.title); setDate(m.date); setResult(m.result); setEditing(false); }}
                      className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-secondary"
                    >
                      <span className="font-medium">{m.title}</span>
                      <span className="text-xs text-muted-foreground">{m.date}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
