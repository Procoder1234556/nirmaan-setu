# Nirmaan Setu — Documentation & Architecture Compatibility Verification

> **Project**: Nirmaan Setu (SIH26122 — Oil India Limited)  
> **Platform**: Next.js 15 (App Router + React Server Actions + Prisma ORM + PostgreSQL)  
> **Host Environment**: Native Windows (No WSL / No Docker required)  
> **Status**: As-built compatibility map for the hackathon web demonstration. The canonical runtime is the Next.js, Prisma, and PostgreSQL application in this repository. The Python/mobile/pgvector architecture in `prompts-directory` remains a future-product reference, not a claim about the shipped implementation.

---

## 1. Specification Compliance Matrix

| Document in Root / `prompts-directory` | Specification Requirements | Next.js Implementation | Compatibility Status |
| :--- | :--- | :--- | :--- |
| **`project-master-directives.md`** (Rule 1.1) | Zero silent misattribution; 3-tier confidence split ($\ge 0.85$ Auto, $0.60-0.85$ Reviewer Queue, $<0.60$ Unmatched) | `src/nirmaan/server/matching/semanticMatcher.ts` & `src/app/reviewer-queue/page.tsx` | **Compatible** |
| **`project-master-directives.md`** (Rule 2.1) | Causal sync, monotonic hardware timestamping ($L_{seq}$), and out-of-order re-sorting | `src/nirmaan/server/sync/causalSync.ts` & `src/app/field-log/page.tsx` | **Compatible** |
| **`project-master-directives.md`** (Rule 2.2) | Dynamic CPM calculation (Forward/Backward pass), Total Float ($TF \le 0$ critical), and prescriptive recovery | `src/nirmaan/server/cpm/cpmEngine.ts` & `src/app/projects/[projectId]/page.tsx` | **Compatible** |
| **`PRD.md` & `APP_FLOW.md`** | 5 core enterprise views: Projects Portfolio, CPM Schedule & Gantt, Reviewer Queue, Field Logger PWA, Historical Benchmarks | `src/app/projects`, `src/app/projects/[projectId]`, `src/app/reviewer-queue`, `src/app/field-log`, `src/app/knowledge-base` | **Compatible** |
| **`TECH_STACK.md`** | Relational + Vector Storage, Primavera P6 `.XER` parsing, MS Project XML parsing | `prisma/schema.prisma` & `src/nirmaan/server/parsers/xerParser.ts` | **Compatible** |
| **`FRONTEND_GUIDELINES.md`** | Dark mode, Oil India brand identity (Amber/Navy/Emerald palette), Radix UI components, Lucide icons, responsive layout | `src/app/globals.css`, `src/components/ui/*`, `src/nirmaan/client/components/NirmaanHeader.tsx` | **Compatible** |
| **`OPEN_SAAS_MODIFICATION_PLAN.md`** | Single in-process TypeScript monolith; eliminating external Python/Celery dependencies for lean execution | Direct port to Next.js Server Actions (`src/app/actions/nirmaan.ts`) with zero external service requirements | **Compatible** |

---

## 2. Framework Glue Mapping: Wasp vs Next.js

| Concept | Open SaaS (Wasp DSL) | Nirmaan Next (Native Windows) |
| :--- | :--- | :--- |
| **Entry Point** | `main.wasp.ts` & `nirmaan.wasp.ts` | Next.js App Router (`src/app/**`) |
| **Backend Calls** | Wasp Queries & Actions | Next.js Server Actions (`'use server'`) |
| **Database ORM** | Prisma via `.wasp/out` | Native Prisma Client (`src/lib/prisma.ts`) |
| **Page Routing** | `route("ProjectsRoute", "/projects", ...)` | File-system routing (`src/app/projects/page.tsx`) |
| **Dynamic Params** | `useParams` from `react-router` | `useParams` from `next/navigation` |
| **Styling** | Tailwind CSS v4 in `Main.css` | Tailwind CSS v4 in `src/app/globals.css` |
| **Local Persistence** | `localStorage` + `operationsClient.ts` | Native reactive client state (`src/nirmaan/client/operationsClient.ts`) |
