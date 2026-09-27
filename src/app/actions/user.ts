'use server';

import { prisma } from '@/lib/prisma';
import * as ops from '@/user/operations';
import type { User } from 'wasp/entities';

// Mocked server context similar to nirmaan.ts.
// We provide the user object to bypass wasp authentication for now.
const serverContext = { 
  prisma,
  entities: { User: prisma.user },
  user: {
    isAdmin: true,
    email: 'admin.pipeline@oilindia.in',
    username: 'oil_super_admin'
  }
};

export async function updateIsUserAdminByIdAction(args: any) {
  return await ops.updateIsUserAdminById(args, serverContext as any);
}

export async function getPaginatedUsersAction(args: any) {
  return await ops.getPaginatedUsers(args, serverContext as any);
}
