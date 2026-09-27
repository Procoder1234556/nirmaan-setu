'use server';

import { prisma } from '@/lib/prisma';
import * as ops from '@/analytics/operations';

// Provide a mock user context until auth is wired up
const serverContext = { 
  prisma,
  user: {
    isAdmin: true,
    email: 'admin.pipeline@oilindia.in',
    username: 'oil_super_admin'
  }
};

export async function getDailyStatsAction() {
  // Pass void as the first arg, then the context
  return await ops.getDailyStats(undefined, serverContext as any);
}
