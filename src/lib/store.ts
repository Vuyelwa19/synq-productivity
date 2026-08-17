import { useCallback, useEffect, useState } from "react";

export type MeetingSummary = {
  id: string;
  title: string;
  date: string;
  createdAt: string;
  result: {
    executiveSummary: string;
    keyPoints: string[];
    decisions: string[];
    actionItems: { task: string; owner: string; deadline: string }[];
    followUps: string[];
    openQuestions: string[];
  };
};

export type PlanTask = {
  id: string;
  title: string;
  subtasks: string[];
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  estimate: string;
  dependsOn: string;
  status: "todo" | "doing" | "done";
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  goal: string;
  deadline: string;
  createdAt: string;
  overview: string;
  phases: { name: string; summary: string }[];
  schedule: { period: string; focus: string }[];
};

export type Research = {
  id: string;
  topic: string;
  collection: string;
  createdAt: string;
  result: {
    overview: string;
    keyFindings: string[];
    concepts: { term: string; definition: string }[];
    evidence: string[];
    sources: { title: string; note: string }[];
    openQuestions: string[];
    summary: string;
    nextSteps: string[];
  };
  followUps: { question: string; answer: string; points: string[] }[];
};

const KEYS = {
  meetings: "np.meetings",
  projects: "np.projects",
  tasks: "np.tasks",
  research: "np.research",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useCollection<T>(key: keyof typeof KEYS) {
  const storageKey = KEYS[key];
  const [items, setItems] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(read<T[]>(storageKey, []));
    setLoaded(true);
  }, [storageKey]);

  const persist = useCallback(
    (next: T[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    },
    [storageKey],
  );

  return { items, setItems: persist, loaded };
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
