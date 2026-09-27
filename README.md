# Nirmaan Setu

Nirmaan Setu is an Oil India project-controls portal for turning field progress into schedule-aware decisions. It provides a deployment-ready demonstration of Primavera schedule ingestion, confidence-based review, causal field logging, CPM delay visibility, and historical benchmarks.

Built with Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, Radix UI, and Lucide icons, it runs locally on Windows and deploys directly to Vercel.

## What is included

- Project portfolio cockpit with critical-path delay health
- Primavera P6 `.XER` and MS Project `.XML` baseline upload flow
- Project CPM and Gantt detail view
- Confidence-routed reviewer queue for ambiguous field events
- Offline-first field-log simulation with monotonic sequence handling
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
```

Never commit `.env`, `.env.local`, database credentials, or Vercel environment files. Add only variables required by enabled integrations; legacy payment, analytics, and file-upload integrations are not required for the Nirmaan Setu core portal.

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
3. Deploy. The container applies the Prisma schema before it starts the web server; no browser-local mock mode is used.
4. Open `https://YOUR-SERVICE.onrender.com/api/health`. It returns `{"status":"ok","database":"connected"}` when the backend is live.
5. Upload a Primavera `.XER` or MS Project `.XML` schedule on `/projects`, then use `/field-log` to send progress into the reviewer/CPM pipeline.

The Render plan covers the API and database. If you later enable cloud transcription or OCR, those providers require their own API credentials; the current field workflow captures voice and photos, preserves them offline, and submits the supervisor's text observation to the matching engine.

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
