import Link from 'next/link';

const steps = [
  ['01', 'Load the approved baseline', 'Upload a Primavera P6 .XER or MS Project .XML schedule. The workspace parses activities, dependencies, dates, and planned duration.'],
  ['02', 'Capture a field update', 'Record a plain-language progress observation in the field workspace. It is queued locally while the browser is offline.'],
  ['03', 'Review before changing the plan', 'Ambiguous matches go to a planner for approval. Confirmed updates recalculate CPM and can be exported as a Primavera XER file.'],
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f4d9] text-[#1b2119] selection:bg-[#d8eba8]">
      <main className="mx-auto max-w-[1440px] px-4 pb-5 pt-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between rounded-full border border-[#1b2119]/15 bg-[#fffdeb]/80 px-4 py-3 backdrop-blur sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-[-0.04em]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#0c493c] font-serif text-lg text-[#f8f4d9]">N</span><span>Nirmaan Setu</span></Link>
          <div className="hidden items-center gap-6 text-sm text-[#4f574a] md:flex"><a href="#workflow" className="transition hover:text-[#0c493c]">Workflow</a><a href="#scope" className="transition hover:text-[#0c493c]">Current scope</a></div>
          <Link href="/projects" className="rounded-full bg-[#0c493c] px-4 py-2 text-sm font-medium text-[#f8f4d9] transition hover:bg-[#153a30]">Open workspace</Link>
        </nav>

        <section className="px-2 pb-12 pt-16 text-center sm:px-8 sm:pt-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#246d57]">SIH26122 · Oil India Limited</p>
          <h1 className="mx-auto max-w-5xl font-serif text-5xl leading-[0.94] tracking-[-0.065em] text-[#22251e] sm:text-7xl lg:text-[6.8rem]">Move field progress into the <em className="font-normal text-[#1e765c]">schedule review.</em></h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#505747] sm:text-lg">Nirmaan Setu is a planning-to-execution bridge for infrastructure schedules: ingest a baseline, capture progress observations, review uncertain activity links, and recalculate CPM.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/projects" className="rounded-full bg-[#0c493c] px-6 py-3 text-sm font-semibold text-[#f8f4d9] transition hover:-translate-y-0.5 hover:bg-[#153a30]">Upload a schedule</Link><a href="#workflow" className="rounded-full border border-[#1b2119]/30 px-6 py-3 text-sm font-semibold transition hover:bg-[#fffdeb]">See the workflow</a></div>
        </section>

        <section id="workflow" className="rounded-[2rem] bg-[#111612] px-5 py-10 text-[#f9f5d9] sm:px-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9d69c]">Current workflow</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><h2 className="font-serif text-4xl leading-none tracking-[-0.045em] sm:text-6xl">From a recorded observation to a reviewed schedule actual.</h2><p className="mt-5 max-w-md text-sm leading-6 text-[#d1d6bd]">The interface shows the state of each step clearly. It does not claim automatic transcription, OCR, encrypted mobile storage, or external intelligence that is not enabled.</p></div><div className="grid gap-3 sm:grid-cols-3">{steps.map(([number, title, copy]) => <article key={number} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="font-serif text-2xl text-[#d8eba8]">{number}</span><h3 className="mt-8 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[#d1d6bd]">{copy}</p></article>)}</div></div>
        </section>

        <section id="scope" className="grid gap-8 px-2 py-20 sm:px-8 lg:grid-cols-2 lg:py-28"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#246d57]">What is available now</p><h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl">A truthful workspace for the core planning loop.</h2></div><div className="grid gap-3 sm:grid-cols-2">{[['Baseline ingestion', 'Primavera XER and MS Project XML parsing with activity and dependency storage.'], ['Confidence routing', 'High-confidence activity links update the schedule; uncertain links wait for review.'], ['CPM visibility', 'Calculate critical path, float, forecast variance, and recovery suggestions.'], ['Primavera export', 'Export stored actuals to an updated XER file.']].map(([title, copy]) => <article key={title} className="rounded-2xl border border-[#1b2119]/15 bg-[#fffdeb] p-5"><h3 className="font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[#505747]">{copy}</p></article>)}</div></section>

        <section className="rounded-[2rem] bg-[#d9c1ef] px-6 py-12 sm:px-10 sm:py-16"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5f3d77]">Start with a real schedule</p><h2 className="mt-4 font-serif text-4xl leading-none tracking-[-0.05em] sm:text-6xl">Your project data drives the screen.</h2><p className="mt-5 max-w-xl text-sm leading-6 text-[#4a4e44]">Portfolio metrics, schedule links, reviewer counts, and historical records are displayed from the connected workspace database—not sample project IDs or fictional outcomes.</p></div><Link href="/projects" className="h-fit rounded-full bg-[#0c493c] px-6 py-3 text-center text-sm font-semibold text-[#f8f4d9] transition hover:bg-[#153a30]">Go to projects</Link></div></section>

        <footer className="flex flex-col gap-5 px-3 pb-4 pt-10 text-xs text-[#667060] sm:flex-row sm:items-end sm:justify-between"><div><p className="font-serif text-2xl text-[#1b2119]">Nirmaan Setu</p><p className="mt-1">Intelligent data capture and schedule-linking for infrastructure projects.</p></div><p>SIH26122 · Smart Automation / Software</p></footer>
      </main>
    </div>
  );
}
