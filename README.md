# Synergy AI

Role

You are an expert AI product designer, UX/UI designer, and full-stack web developer. Build a modern, professional, responsive AI productivity website that combines three powerful tools:

Meeting Notes Summarizer

AI Task Planner

AI Research Assistant

Context

The website is designed for students, professionals, entrepreneurs, teams, researchers, and anyone who wants to save time and organize information using AI.

The platform should provide a simple dashboard where users can upload information, enter text, or provide instructions and receive useful AI-generated results.

The overall experience should feel intelligent, clean, fast, trustworthy, and easy to use.

Objective

Create an AI productivity platform that helps users:

Convert long meeting notes into concise summaries.

Extract important decisions, action items, and deadlines from meetings.

Turn goals and projects into organized task plans.

Prioritize tasks according to urgency and importance.

Conduct AI-assisted research and generate structured research results.

Save, edit, copy, and export AI-generated results.

Requirements

1. Homepage

Create an attractive landing page containing:

Website name and logo.

Hero section with a strong headline such as:
"Work Smarter. Plan Better. Research Faster."

Short description explaining the three AI tools.

"Get Started" call-to-action button.

Feature cards for:

Meeting Notes Summarizer

AI Task Planner

AI Research Assistant

Benefits section.

How It Works section.

Testimonials section.

Pricing section.

FAQ section.

Footer with navigation and social links.

2. Meeting Notes Summarizer

Create a dedicated tool where users can:

Paste meeting notes.

Upload a text/document file.

Enter meeting title and date.

Select summary length.

Generate an AI summary.

The output should include:

Executive Summary

Key Discussion Points

Important Decisions

Action Items

Assigned People

Deadlines

Follow-up Items

Questions/Issues Raised

Include buttons for:

Copy

Edit

Download

Save

Generate Again

3. AI Task Planner

Create an AI-powered task planning interface where users can enter:

Project name

Goal

Description

Deadline

Priority

Available time

Optional existing tasks

The AI should generate:

Project breakdown

Task list

Subtasks

Priority levels

Suggested deadlines

Estimated time

Dependencies

Daily/weekly schedule

Include a visual task board with:

To Do

In Progress

Completed

Allow users to mark tasks as completed, edit tasks, delete tasks, and reorder tasks.

4. AI Research Assistant

Create a research workspace where users can enter a research question or topic.

The AI Research Assistant should generate:

Research overview

Key findings

Important concepts

Supporting evidence

Sources/references

Research questions

Summary

Suggested next steps

Allow users to:

Ask follow-up questions.

Save research.

Copy results.

Export results.

Organize research into projects.

Clearly distinguish AI-generated information from verified sources and encourage users to verify important information.

5. Dashboard

Create a user dashboard containing:

Welcome message.

Recent projects.

Recent meeting summaries.

Active tasks.

Research projects.

Productivity statistics.

Quick-action buttons.

Quick actions:

Summarize Meeting | Create Task Plan | Start Research

6. UI/UX Design

Use a modern SaaS-style interface with:

Clean typography.

Professional spacing.

Responsive design.

Mobile, tablet, and desktop layouts.

Intuitive navigation.

Cards and dashboards.

Clear call-to-action buttons.

Loading animations while AI is processing.

Success and error notifications.

Accessible forms and buttons.

Light and dark mode.

Constraints

Do not create a cluttered interface.

Keep navigation simple and intuitive.

Do not expose API keys in frontend code.

Use secure authentication if accounts are implemented.

Protect user-generated content.

Clearly label AI-generated content.

Do not present AI-generated research as automatically verified fact.

Make the website responsive across modern browsers.

Avoid unnecessary animations that negatively affect performance.

Use reusable components and clean, maintainable code.

If a real AI API is unavailable, create realistic mock AI responses so the interface remains fully demonstrable.

Inputs

The system should accept:

Meeting notes

Uploaded documents

Project goals

Task descriptions

Deadlines

Priorities

Research questions

Research topics

Follow-up questions

User instructions

Outputs

The website should produce:

Meeting Notes

Concise summary

Key points

Decisions

Action items

Responsibilities

Deadlines

Follow-ups

Task Planner

Project plan

Prioritized tasks

Subtasks

Timeline

Schedule

Estimated completion times

Research Assistant

Research summary

Key findings

Evidence

Sources

Research questions

Follow-up recommendations

Technical Requirements

Build the website using a modern frontend framework such as React/Next.js with a clean component-based architecture.

Include:

Responsive navigation.

Reusable UI components.

Form validation.

State management.

AI processing/loading states.

Error handling.

Local persistence or database-ready architecture.

Secure server-side handling for AI API requests.

Export functionality where appropriate.

Final Output

Deliver a polished, production-style AI productivity website with three primary AI tools:

Meeting Notes Summarizer + AI Task Planner + AI Research Assistant

The website should feel like a single intelligent productivity platform rather than three unrelated tools. Use consistent branding, navigation, colors, typography, and components throughout the entire experience.

The final interface should be visually impressive, easy for beginners to understand, and powerful enough for professional users.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://synq-productivity.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e2bbe3b7-11cf-4587-956e-de360ad8bc48).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
