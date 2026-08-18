# NorthPilot

NorthPilot is an AI-powered productivity platform that turns raw notes into actionable outcomes. It combines three integrated tools — a **Meeting Notes Summarizer**, an **AI Task Planner**, and an **AI Research Assistant** — into a single, responsive dashboard.

## Features

- **Meeting Notes Summarizer** — Paste or upload notes and get an executive summary, key points, decisions, action items with owners and deadlines, follow-ups, and open questions.
- **AI Task Planner** — Generate project plans with phases, tasks, subtasks, priorities, estimates, and due dates. View and manage work on a Kanban-style board (To Do, In Progress, Completed).
- **AI Research Assistant** — Research topics, collect findings, define concepts, gather evidence, list suggested sources, and ask follow-up questions.
- **Dashboard** — See productivity stats, recent projects, summaries, active tasks, and quick actions across all tools.
- **Dark & light mode** — Theme-aware UI with a consistent design system.
- **Local persistence** — Work is saved in `localStorage` so it survives reloads.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — typed JavaScript
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — accessible components
- [Lovable AI Gateway](https://docs.lovable.dev/ai-guardrails) — secure server-side AI calls

## Getting started

### Prerequisites

- Node.js (v20 or later recommended)
- A package manager such as `npm`, `bun`, or `pnpm`

### Install

```sh
npm install
```

### Run the development server

```sh
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for production

```sh
npm run build
```

## Project structure

```text
src/
  components/     # Reusable UI components
  hooks/          # Custom React hooks
  lib/            # Utilities, AI functions, and data layer
  routes/         # TanStack Start file-based routes
  server.ts       # Server entry point
  start.ts        # Client entry point
  styles.css      # Global theme and Tailwind imports
```

## AI configuration

NorthPilot uses Lovable's managed AI gateway. The `LOVABLE_API_KEY` environment variable is injected automatically in the Lovable environment; the key is never sent to the browser.

## Deployment

This project is built with Lovable and can be published directly from the Lovable editor. You can also connect the project to GitHub and deploy the generated code to any hosting provider that supports Vite-based React apps.

## License

This project is built and owned by the creator. See the Lovable project settings for export and deployment options.

---

Built with [Lovable](https://lovable.dev).
