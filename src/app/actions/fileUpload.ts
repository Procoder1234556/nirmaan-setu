'use server';

import { prisma } from '@/lib/prisma';
import * as ops from '@/file-upload/operations';

const serverContext = { 
  prisma,
  entities: { User: prisma.user, File: prisma.file },
  user: {
    isAdmin: true,
    email: 'admin.pipeline@oilindia.in',
    username: 'oil_super_admin'
  }
};

export async function getAllFilesByUserAction(args: any) {
  return await ops.getAllFilesByUser(args, serverContext as any);
}

export async function getDownloadFileSignedURLAction(args: any) {
  return await ops.getDownloadFileSignedURL(args, serverContext as any);
}

export async function addFileToDbAction(args: any) {
  return await ops.addFileToDb(args, serverContext as any);
}

export async function createFileUploadUrlAction(args: any) {
  return await ops.createFileUploadUrl(args, serverContext as any);
}

export async function deleteFileAction(args: any) {
  return await ops.deleteFile(args, serverContext as any);
}
