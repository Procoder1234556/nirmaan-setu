'use server';

import { prisma } from '@/lib/prisma';
import * as ops from '@/demo-ai-app/operations';

const serverContext = { 
  prisma,
  entities: { User: prisma.user, Task: prisma.task, GptResponse: prisma.gptResponse },
  user: {
    isAdmin: true,
    email: 'admin.pipeline@oilindia.in',
    username: 'oil_super_admin'
  }
};

export async function getGptResponsesAction(args: any) {
  return await ops.getGptResponses(args, serverContext as any);
}

export async function generateGptResponseAction(args: any) {
  return await ops.generateGptResponse(args, serverContext as any);
}

export async function getAllTasksByUserAction(args: any) {
  return await ops.getAllTasksByUser(args, serverContext as any);
}

export async function createTaskAction(args: any) {
  return await ops.createTask(args, serverContext as any);
}

export async function updateTaskAction(args: any) {
  return await ops.updateTask(args, serverContext as any);
}

export async function deleteTaskAction(args: any) {
  return await ops.deleteTask(args, serverContext as any);
}
