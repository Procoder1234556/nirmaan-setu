'use client';

import { ArrowLeft, CheckCircle2, Clock, MessageSquareText, UserRound } from 'lucide-react';
import { NirmaanHeader } from '../components/NirmaanHeader';
import { useFieldWorkerHistory } from '../operationsClient';

const formatDate = (value: string | Date) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function FieldHistoryPage() {
  const { items, isLoading } = useFieldWorkerHistory();

  return <div className="min-h-screen bg-background pb-12"><NirmaanHeader currentTab="field-log" /><main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
    <div className="flex items-start gap-3"><a href="/field-log" className="mt-0.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border" aria-label="Back to Field Logger"><ArrowLeft className="h-4 w-4" /></a><div><h2 className="text-2xl font-bold tracking-tight">My upload history</h2><p className="mt-1 text-xs text-muted-foreground">Your submitted observations and the decision or remark left by a manager or administrator.</p></div></div>
    {isLoading ? <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">Loading your history…</div> : items.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No synced uploads yet. Save an observation in Field Logger and choose Sync to see it here.</div> : <div className="space-y-3">{items.map((item) => {
      const review = item.reviewerItem;
      const reviewerName = review?.reviewer?.username || review?.reviewer?.email || 'Awaiting manager review';
      const status = item.status?.replaceAll('_', ' ') || 'PENDING MATCH';
      return <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold">{item.rawText}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.project?.code || 'Project'} · uploaded {formatDate(item.eventTimestampHw)}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${item.status === 'REJECTED' ? 'bg-red-500/10 text-red-700' : item.status === 'MANUALLY_MATCHED' || item.status === 'AUTO_MATCHED' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>{status}</span></div>
        {item.matchedActivity && <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs"><span className="font-semibold">Schedule activity:</span> {item.matchedActivity.activityCode} — {item.matchedActivity.name}</div>}
        <div className="mt-3 border-t border-border pt-3 text-xs"><div className="flex items-center gap-1.5 font-semibold"><UserRound className="h-3.5 w-3.5 text-primary" /> {reviewerName}</div>{review?.resolvedAt ? <p className="mt-1 text-muted-foreground">Reviewed {formatDate(review.resolvedAt)} · {review.resolution?.toLowerCase()}</p> : <p className="mt-1 text-muted-foreground">Still waiting for manager or administrator review.</p>}{review?.matchRationale && <p className="mt-2 flex gap-1.5 rounded-lg bg-primary/5 p-2 leading-relaxed text-foreground"><MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{review.matchRationale}</p>}</div>
      </article>;
    })}</div>}
  </main></div>;
}
