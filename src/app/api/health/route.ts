import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Render health probe: a 200 means the web process and PostgreSQL are ready. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: 'unhealthy', database: 'unavailable' }, { status: 503 });
  }
}
