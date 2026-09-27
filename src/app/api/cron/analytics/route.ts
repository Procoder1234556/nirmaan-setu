import { NextResponse } from 'next/server';
/**
 * The inherited Open SaaS analytics job depends on payment and Express
 * middleware that are outside the Nirmaan Setu portal scope. Keep the route
 * explicit but dependency-free so an optional cron cannot break deployment.
 */
export async function GET() {
  return NextResponse.json(
    { enabled: false, message: 'Analytics cron is not configured for this deployment.' },
    { status: 503 }
  );
}
