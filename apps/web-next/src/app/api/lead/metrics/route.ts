import { NextRequest, NextResponse } from 'next/server';
import { isLeadEventsAdminAuthorized } from '@/lib/lead-admin';
import { isLeadDbConfigured, queryLeadEventMetrics } from '@/lib/lead-db';

export const dynamic = 'force-dynamic';

const METRICS_ERROR_MESSAGE = 'Lead metrics are temporarily unavailable';

function normalizeParam(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export async function GET(request: NextRequest) {
  if (!isLeadEventsAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: { code: 'UNAUTHORIZED' } },
      { status: 401 },
    );
  }

  if (!isLeadDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: { code: 'DATABASE_NOT_CONFIGURED' } },
      { status: 503 },
    );
  }

  const params = request.nextUrl.searchParams;
  try {
    const metrics = await queryLeadEventMetrics({
      from: normalizeParam(params.get('from')),
      to: normalizeParam(params.get('to')),
    });

    return NextResponse.json(
      { ok: true, source: 'neon_lead_events', metrics },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[santi_lead_metrics] FAILURE:', { message });
    return NextResponse.json(
      { ok: false, error: { code: 'METRICS_ERROR', message: METRICS_ERROR_MESSAGE } },
      { status: 500 },
    );
  }
}
