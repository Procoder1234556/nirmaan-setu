'use server';

import { prisma } from '@/lib/prisma';
import * as ops from '@/payment/operations';

const serverContext = { 
  prisma,
  entities: { User: prisma.user },
  user: {
    isAdmin: true,
    email: 'admin.pipeline@oilindia.in',
    username: 'oil_super_admin'
  }
};

export async function getCustomerPortalUrlAction(args: any) {
  return await ops.getCustomerPortalUrl(args, serverContext as any);
}

export async function generateCheckoutSessionAction(args: any) {
  return await ops.generateCheckoutSession(args, serverContext as any);
}
