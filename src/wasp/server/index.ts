import { prisma } from '@/lib/prisma';
import type { PrismaClient } from '@prisma/client';

export class HttpError extends Error {
  statusCode: number;
  data?: any;

  constructor(statusCode: number, message?: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const env = process.env as Record<string, string | undefined>;

export { prisma };
export type { PrismaClient };
export type MiddlewareConfigFn = (middlewareConfig: any) => any;
