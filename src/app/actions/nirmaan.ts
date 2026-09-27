'use server';

import { prisma } from '@/lib/prisma';
import * as ops from '@/nirmaan/server/operations';
import type {
  UploadBaselineInput,
  SyncFieldEventsInput,
  ResolveReviewerInput,
  TriggerCPMInput,
  ExportXERInput,
} from '@/nirmaan/server/operations';

const serverContext = { prisma };

export async function uploadScheduleBaselineAction(args: UploadBaselineInput) {
  return await ops.uploadScheduleBaseline(args, serverContext);
}

export async function bootstrapJudgingDemoAction() {
  return await ops.bootstrapJudgingDemo(serverContext);
}

export async function getProjectsAction() {
  return await ops.getProjects({}, serverContext);
}

export async function getProjectDetailsAction(args: { projectId: string }) {
  return await ops.getProjectDetails(args, serverContext);
}

export async function getReviewerQueueAction() {
  return await ops.getReviewerQueue({}, serverContext);
}

export async function getDelayPredictionsAction(args: { projectId: string }) {
  return await ops.getDelayPredictions(args, serverContext);
}

export async function getHistoricalBenchmarksAction() {
  return await ops.getHistoricalBenchmarks({}, serverContext);
}

export async function syncFieldEventsBatchAction(args: SyncFieldEventsInput) {
  return await ops.syncFieldEventsBatch(args, serverContext);
}

export async function resolveReviewerItemAction(args: ResolveReviewerInput) {
  return await ops.resolveReviewerItem(args, serverContext);
}

export async function triggerCPMRecalculationAction(args: TriggerCPMInput) {
  return await ops.triggerCPMRecalculation(args, serverContext);
}

export async function exportPrimaveraXERAction(args: ExportXERInput) {
  return await ops.exportPrimaveraXER(args, serverContext);
}
