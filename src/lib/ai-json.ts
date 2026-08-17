/**
 * Tolerant JSON parsing for model output.
 * Models can stop mid-object when they hit the output token cap, which yields
 * truncated (but otherwise valid) JSON. We repair the tail so the app can still
 * use whatever fields completed.
 */

function repair(raw: string): string {
  let s = raw.trim();

  // Drop markdown fences if present.
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let lastSafe = -1; // index after the last completed value at depth > 0

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();

    if (!inString && (ch === "}" || ch === "]" || ch === '"' || /[0-9a-z]/i.test(ch))) {
      lastSafe = i + 1;
    }
  }

  // If we ended inside a string, cut back to the last completed value.
  if (inString && lastSafe > 0) {
    s = s.slice(0, lastSafe);
    // Recompute the open-container stack after the cut.
    return repair(s);
  }

  // Remove a dangling key or comma at the end (e.g. `..., "sources":` ).
  s = s.replace(/,\s*$/, "").replace(/,?\s*"[^"]*"\s*:\s*$/, "");

  // Close any still-open containers.
  while (stack.length) s += stack.pop();

  return s;
}

export function parseModelJson<T = Record<string, unknown>>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    // ignore and try to repair
  }

  const start = content.indexOf("{");
  const candidate = start >= 0 ? content.slice(start) : content;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    // ignore and try to repair
  }

  try {
    return JSON.parse(repair(candidate)) as T;
  } catch {
    throw new Error(
      "The AI returned an incomplete response. Try again, or shorten the input.",
    );
  }
}
