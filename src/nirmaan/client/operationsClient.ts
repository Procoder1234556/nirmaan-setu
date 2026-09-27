'use client';

/** Browser client for the persisted Nirmaan Setu backend. */
import { useCallback, useEffect, useState } from 'react';
import {
  exportPrimaveraXERAction, getHistoricalBenchmarksAction, getProjectDetailsAction,
  getProjectsAction, getReviewerQueueAction, resolveReviewerItemAction,
  syncFieldEventsBatchAction, triggerCPMRecalculationAction, uploadScheduleBaselineAction,
} from '@/app/actions/nirmaan';
import type { MockActivity, MockBenchmark, MockDelayPrediction, MockProject, MockReviewerItem } from './mockData';

const SYSTEM_SUPERVISOR_ID = 'system-field-supervisor';

function asProject(project: any): MockProject {
  const delay = Number(project.criticalPathDelayDays || 0);
  return { ...project, plannedStartDate: new Date(project.plannedStartDate).toISOString(),
    plannedFinishDate: new Date(project.plannedFinishDate).toISOString(),
    currentForecastFinishDate: project.currentForecastFinishDate ? new Date(project.currentForecastFinishDate).toISOString() : null,
    criticalPathDelayDays: delay, activitiesCount: project._count?.activities || project.activities?.length || 0,
    fieldEventsCount: project._count?.fieldEvents || 0, status: delay > 5 ? 'RED' : delay > 0 ? 'AMBER' : 'GREEN' } as MockProject;
}
function asActivity(activity: any): MockActivity {
  return { ...activity, plannedStart: new Date(activity.plannedStart).toISOString(), plannedFinish: new Date(activity.plannedFinish).toISOString(),
    actualStart: activity.actualStart ? new Date(activity.actualStart).toISOString() : null,
    actualFinish: activity.actualFinish ? new Date(activity.actualFinish).toISOString() : null } as MockActivity;
}
function asPrediction(prediction: any): MockDelayPrediction {
  return { ...prediction, predictedMilestoneDate: new Date(prediction.predictedMilestoneDate).toISOString(),
    mitigationRecommendations: Array.isArray(prediction.mitigationRecommendations) ? prediction.mitigationRecommendations : [] } as MockDelayPrediction;
}
function asQueueItem(item: any): MockReviewerItem {
  return { ...item, fieldEvent: { ...item.fieldEvent, eventTimestampHw: new Date(item.fieldEvent.eventTimestampHw).toISOString(), monotonicSeq: Number(item.fieldEvent.monotonicSeq) },
    topCandidate: asActivity(item.topCandidate), alternateCandidates: Array.isArray(item.alternateCandidates) ? item.alternateCandidates : [] } as MockReviewerItem;
}

export function useProjects() {
  const [projects, setProjects] = useState<MockProject[]>([]); const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => { setIsLoading(true); try { setProjects((await getProjectsAction()).map(asProject)); setError(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load projects.'); } finally { setIsLoading(false); } }, []);
  useEffect(() => { void reload(); }, [reload]); return { projects, isLoading, error, refetch: reload };
}

export function useProjectDetails(projectId: string) {
  const [project, setProject] = useState<MockProject | null>(null); const [activities, setActivities] = useState<MockActivity[]>([]);
  const [predictions, setPredictions] = useState<MockDelayPrediction[]>([]);
  const reload = useCallback(async () => { if (!projectId) return; const details: any = await getProjectDetailsAction({ projectId });
    setProject(asProject(details)); setActivities((details.activities || []).map(asActivity)); setPredictions((details.delayPredictions || []).map(asPrediction)); }, [projectId]);
  useEffect(() => { void reload().catch(() => undefined); }, [reload]); return { project, activities, predictions, refetch: reload };
}

export function useReviewerQueue() {
  const [items, setItems] = useState<MockReviewerItem[]>([]); const [isLoading, setIsLoading] = useState(true);
  const reload = useCallback(async () => { setIsLoading(true); try { setItems((await getReviewerQueueAction()).map(asQueueItem)); } finally { setIsLoading(false); } }, []);
  useEffect(() => { void reload().catch(() => undefined); }, [reload]); return { items, allItemsCount: items.length, pendingCount: items.length, isLoading, refetch: reload };
}

export async function resolveReviewerItem(args: { queueItemId: string; resolution: 'APPROVED' | 'REASSIGNED' | 'SPLIT' | 'DISMISSED'; finalActivityId?: string; progressDeltaPercent?: number; }) { return resolveReviewerItemAction(args); }
export async function uploadScheduleBaseline(args: { fileContent: string; fileType?: 'XER' | 'XML'; projectCodeOverride?: string; }) { return uploadScheduleBaselineAction(args); }
export async function triggerCPMRecalculation(args: { projectId: string }) { return triggerCPMRecalculationAction(args); }
export async function exportPrimaveraXER(args: { projectId: string }) { return exportPrimaveraXERAction(args); }
export async function syncFieldEventsBatch(args: { projectId: string; events: Array<{ clientEventId: string; deviceId: string; supervisorId?: string; sourceType: 'MOBILE_VOICE' | 'MOBILE_FORM' | 'EXCEL_DPR'; rawText: string; eventTimestampHw: string; monotonicSeq: number; }>; }) {
  return syncFieldEventsBatchAction({ ...args, events: args.events.map((event) => ({ ...event, supervisorId: event.supervisorId || SYSTEM_SUPERVISOR_ID })) });
}
export function useHistoricalBenchmarks(disciplineFilter?: string) {
  const [benchmarks, setBenchmarks] = useState<MockBenchmark[]>([]);
  useEffect(() => { void getHistoricalBenchmarksAction().then((rows: any[]) => setBenchmarks(rows.map((row) => ({ ...row, recordedDelays: Array.isArray(row.recordedDelays) ? row.recordedDelays : [] })) as MockBenchmark[])).catch(() => setBenchmarks([])); }, []);
  const filtered = disciplineFilter && disciplineFilter !== 'ALL' ? benchmarks.filter((benchmark) => benchmark.discipline.toLowerCase() === disciplineFilter.toLowerCase()) : benchmarks;
  return { benchmarks: filtered };
}
