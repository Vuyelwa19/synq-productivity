import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  kind: z.enum(["meeting", "plan", "research", "followup"]),
  payload: z.record(z.any()),
});

const SYSTEM: Record<string, string> = {
  meeting: `You summarize meeting notes. Return STRICT JSON:
{"executiveSummary":string,"keyPoints":string[],"decisions":string[],"actionItems":[{"task":string,"owner":string,"deadline":string}],"followUps":string[],"openQuestions":string[]}`,
  plan: `You are a project planning assistant. Return STRICT JSON:
{"overview":string,"phases":[{"name":string,"summary":string}],"tasks":[{"title":string,"subtasks":string[],"priority":"High"|"Medium"|"Low","dueDate":string,"estimate":string,"dependsOn":string}],"schedule":[{"period":string,"focus":string}]}`,
  research: `You are a research assistant. Be honest about uncertainty. Sources must be plausible, clearly labelled as suggested starting points, never fabricated as verified. Return STRICT JSON:
{"overview":string,"keyFindings":string[],"concepts":[{"term":string,"definition":string}],"evidence":string[],"sources":[{"title":string,"note":string}],"openQuestions":string[],"summary":string,"nextSteps":string[]}`,
  followup: `Answer the follow-up research question concisely. Return STRICT JSON:
{"answer":string,"points":string[]}`,
};

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM[data.kind] },
          { role: "user", content: JSON.stringify(data.payload) },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Too many requests right now. Please retry in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted. Add credits to continue.");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content) as Record<string, any>;
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]) as Record<string, any>;
      throw new Error("The AI returned an unreadable response. Try again.");
    }
  });
