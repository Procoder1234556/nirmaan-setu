# Nirmaan Setu

Nirmaan Setu is an Oil India project-controls portal for turning field progress into schedule-aware decisions. It provides a deployment-ready demonstration of Primavera schedule ingestion, confidence-based review, causal field logging, CPM delay visibility, and historical benchmarks.

Built with Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, Radix UI, and Lucide icons, it runs locally on Windows and deploys directly to Vercel.

## What is included

- Project portfolio cockpit with critical-path delay health
- Primavera P6 `.XER` and MS Project `.XML` baseline upload flow
- Project CPM and Gantt detail view
- Confidence-routed reviewer queue for ambiguous field events
- Offline-first field-log capture with monotonic sequence handling and voice-to-text notes
- Historical benchmark knowledge base
- In-process TypeScript CPM, schedule parsing, semantic matching, causal sync, and Primavera export modules

The product requirements and architecture references live in the sibling `prompts-directory` folder. The implementation mapping is available in [ARCHITECTURE_MAPPING.md](ARCHITECTURE_MAPPING.md).

## Requirements

- Node.js 20.9 through 24
- pnpm 10 or newer
- PostgreSQL only when enabling Prisma-backed server actions and persistent data

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. Prisma Client is generated automatically before production builds. To regenerate it explicitly, run:

```bash
pnpm prisma generate
```

## Quality checks

```bash
pnpm typecheck
pnpm build
```

`pnpm build` is the same production build used by Vercel and generates Prisma Client first. TypeScript errors fail the build; run `pnpm lint` as a separate CI gate while this Next 15.2 application remains on its current ESLint integration.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Product overview and entry point |
| `/projects` | Portfolio health cockpit and schedule baseline upload |
| `/projects/[projectId]` | CPM schedule, critical path, Gantt, and mitigation details |
| `/reviewer-queue` | Human review of uncertain schedule matches |
| `/field-log` | Offline-first supervisor progress capture workflow |
| `/knowledge-base` | Historical completed-project benchmarks |

All core views call the PostgreSQL-backed server actions in `src/app/actions/nirmaan.ts`. Schedule uploads, field reports, review decisions, CPM recalculations and Primavera exports are persisted and executed on the server; browser storage is used only for the offline field-capture outbox.

## Environment variables

The core demonstration routes do not require secrets. For database-backed server actions, configure this in `.env.local` and Vercel Project Settings:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/nirmaan_setu?schema=public"
GROQ_API_KEY=""
```

`GROQ_API_KEY` is required for AI-assisted activity matching and `/field-log` voice transcription. It is used only in server routes and server actions; never expose it as a `NEXT_PUBLIC_*` value or commit it. Without it, the deterministic matching fallback remains available, while transcription clearly reports that it has not been configured.

Never commit `.env`, `.env.local`, database credentials, API keys, or Vercel environment files. Add only variables required by enabled integrations; legacy payment, analytics, and file-upload integrations are not required for the Nirmaan Setu core portal.

## Deploy to Vercel

1. Import the repository in Vercel.
2. Set the **Root Directory** to `nirmaan-next` if importing the parent workspace; otherwise use the project root.
3. Add `DATABASE_URL` only if using persistent server actions.
4. Deploy. Vercel uses `pnpm install --frozen-lockfile` and `pnpm run build` from [vercel.json](vercel.json).

For a CLI deployment from this directory:

```bash
pnpm run build
vercel deploy --prebuilt
```

Use `vercel deploy --prebuilt --prod` only after validating a preview deployment.

## Deploy to Render (production backend)

This repository includes a Render Blueprint at [`render.yaml`](render.yaml). It provisions a Starter web service and a PostgreSQL database, starts the Next.js API/backend, and probes `/api/health` only after PostgreSQL is reachable.

1. Push the `nirmaan-next` directory to a Git repository.
2. In Render, choose **New → Blueprint**, select that repository, and accept the generated `nirmaan-setu` web service and `nirmaan-setu-db` database.
3. Set `GROQ_API_KEY` in the Render web service's Environment settings, then deploy. The Blueprint deliberately marks this as a non-synced secret, so its value is never stored in Git.
4. The container applies the Prisma schema before it starts the web server; no browser-local mock mode is used.
5. Open `https://YOUR-SERVICE.onrender.com/api/health`. It returns `{"status":"ok","database":"connected"}` when the backend is live.
6. For the live judging path, select **Load judging demo** on `/projects`, record or type a field observation in `/field-log`, sync it, review low-confidence matches in `/reviewer-queue`, then open the project Gantt to show the resulting schedule impact.

The Render plan covers the API and database. Groq provides the optional server-side transcription and constrained semantic activity matching. Photo and voice evidence is retained with the queued field event; spreadsheet and scanned-document ingestion remain future extension paths.

## Project structure

```text
src/app/                 Next.js routes and server actions
src/nirmaan/client/      Portfolio, field, reviewer, and knowledge-base interfaces
src/nirmaan/server/      CPM, parser, matcher, sync, and export engines
prisma/schema.prisma     PostgreSQL domain schema
public/                  Static assets
```

## Notes for contributors

- Keep the core feature scope aligned with the PRD and app-flow documentation.
- Use `pnpm`, not npm, so the committed lockfile remains reproducible.
- Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` before opening a pull request.
- Keep TypeScript build checks enabled before deployment.
