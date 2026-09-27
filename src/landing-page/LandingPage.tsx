import Link from 'next/link';
import { ArrowUpRight, Check, Mic, ShieldCheck } from 'lucide-react';

const outcomes = [
  ['Speak naturally', 'Capture the way a supervisor reports work, with the site context and time of capture.'],
  ['See the proposed link', 'Compare the observation with the scheduled activity and inspect its confidence before accepting it.'],
  ['Update only when trusted', 'Route uncertain records to a planner, then recalculate the schedule from verified actuals.'],
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f4f1] text-[#111110] selection:bg-[#d9f7a4]">
      <main className="mx-auto max-w-[1500px] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <nav className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/70 px-4 backdrop-blur sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 font-semibold tracking-[-0.04em]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#171717] text-sm font-bold text-[#d9f7a4]">N</span>
            <span className="truncate">Nirmaan Setu</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-black/55 md:flex">
            <a href="#workflow" className="transition hover:text-black">How it works</a>
            <a href="#scope" className="transition hover:text-black">What is live</a>
          </div>
          <Link href="/projects" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[#171717] px-3.5 text-sm font-semibold text-white transition hover:bg-black sm:px-4">
            Open workspace <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>

        <section className="pb-12 pt-16 text-center sm:pb-20 sm:pt-24 lg:pt-28">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/65">
            <span className="h-1.5 w-1.5 rounded-full bg-[#74a63f]" />
            SIH26122 · Oil India Limited
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.93] tracking-[-0.065em] sm:text-7xl lg:text-[6.9rem]">
            Tell us what happened.
            <span className="block text-[#578a2c]">See what it changes.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-black/60 sm:text-lg">
            Nirmaan Setu connects plain-language site progress to the activity that drives the plan, so schedule updates remain visible, reviewable, and grounded in field evidence.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/field-log" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-black">
              Capture a field update <Mic className="h-4 w-4" />
            </Link>
            <Link href="/projects" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-black/35">
              View project controls
            </Link>
          </div>
        </section>

        <section aria-label="Field update transformation" className="rounded-[2rem] bg-[#171717] p-3 shadow-[0_22px_70px_rgba(17,17,16,0.18)] sm:p-5">
          <div className="grid overflow-hidden rounded-[1.45rem] bg-[#f7f7f4] lg:grid-cols-[1fr_72px_1fr]">
            <div className="p-5 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">Field observation</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f8d1] px-2.5 py-1 text-[11px] font-semibold text-[#43711e]"><Mic className="h-3.5 w-3.5" /> Voice or text</span>
              </div>
              <div className="mt-12 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-sm leading-6 text-black/85">“Trenching is complete from kilometre 0 to 25. The crew is ready for the next section once the right of way is cleared.”</p>
                <div className="mt-5 flex items-center gap-2 border-t border-black/8 pt-3 text-xs text-black/45"><span className="h-2 w-2 rounded-full bg-[#74a63f]" /> Timestamped at source</div>
              </div>
              <p className="mt-4 text-sm leading-6 text-black/55">Capture observations as crews describe the work. Offline records stay in the local outbox until they are synced.</p>
            </div>
            <div className="hidden items-center justify-center bg-[#e5f7cc] lg:flex"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#171717] text-[#d9f7a4]"><ArrowUpRight className="h-5 w-5" /></div></div>
            <div className="border-t border-black/10 bg-[#e5f7cc] p-5 lg:border-l lg:border-t-0 sm:p-8">
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50">Schedule decision</p><span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold text-white">Planner review</span></div>
              <div className="mt-12 rounded-2xl border border-black/10 bg-white/85 p-4 shadow-sm sm:p-5">
                <p className="text-xs font-medium text-black/50">Proposed activity</p><p className="mt-2 text-xl font-semibold tracking-[-0.035em]">ACT-TR-02 · Trenching km 0-25</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/8 pt-3"><span className="text-xs font-medium text-black/55">Match confidence</span><span className="rounded-full bg-[#e6f8d1] px-2.5 py-1 text-xs font-semibold text-[#43711e]">Review required</span></div>
              </div>
              <p className="mt-4 text-sm leading-6 text-black/60">A planner can approve, reassign, or dismiss the proposed link before verified actuals affect CPM and forecast dates.</p>
            </div>
          </div>
        </section>

        <section id="workflow" className="grid gap-4 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="px-1 sm:px-3"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#578a2c]">The planning-to-execution bridge</p><h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Less chasing. More traceable progress.</h2></div>
          <div className="grid gap-3 sm:grid-cols-3">{outcomes.map(([title, copy], index) => <article key={title} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e5f7cc] text-xs font-semibold text-[#43711e]">0{index + 1}</span><h3 className="mt-10 text-xl font-semibold tracking-[-0.035em]">{title}</h3><p className="mt-3 text-sm leading-6 text-black/55">{copy}</p></article>)}</div>
        </section>

        <section id="scope" className="grid gap-4 rounded-[2rem] bg-white p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#578a2c]">What is live now</p><h2 className="mt-4 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">Build confidence before changing the schedule.</h2><p className="mt-5 max-w-md text-sm leading-6 text-black/55">The current workflow ingests Primavera XER and MS Project XML baselines, captures typed field observations, proposes activity links, routes uncertainty to review, recalculates CPM, and exports XER actuals.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">{[['Baseline intake', 'Primavera XER and MS Project XML schedule parsing.'], ['Reviewer queue', 'Proposed activity links remain explicit and reversible.'], ['CPM visibility', 'Critical path, float, and forecast variance from verified actuals.'], ['Evidence boundaries', 'Photos and recordings stay local in the current MVP. OCR and voice transcription are not yet enabled.']].map(([title, copy]) => <div key={title} className="rounded-2xl bg-[#f5f4f1] p-4 sm:p-5"><Check className="h-4 w-4 text-[#578a2c]" /><h3 className="mt-7 font-semibold tracking-[-0.025em]">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55">{copy}</p></div>)}</div>
        </section>

        <footer className="flex flex-col gap-4 px-2 pb-3 pt-10 text-xs text-black/45 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-semibold text-black">Nirmaan Setu</p><p className="mt-1">Infrastructure schedule-linking for Oil India Limited.</p></div><p className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SIH26122 · Smart Automation / Software</p></footer>
      </main>
    </div>
  );
}
