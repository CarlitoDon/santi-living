import { NextRequest, NextResponse } from 'next/server';
import { isLeadDbConfigured, queryLeadEvents } from '@/lib/lead-db';
import { leadRowsToCsv } from '@/lib/lead-export';

export const dynamic = 'force-dynamic';

function normalizeParam(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? 500);
  if (!Number.isFinite(parsed)) return 500;
  return Math.min(Math.max(Math.trunc(parsed), 1), 1000);
}

function parseOffset(value: string | null): number {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(Math.trunc(parsed), 0);
}

function isAuthorized(request: NextRequest): boolean {
  const token = process.env.LEAD_EVENTS_ADMIN_TOKEN;
  if (!token) return false;
  const header = request.headers.get('authorization') ?? '';
  return header === `Bearer ${token}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
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
  const format = normalizeParam(params.get('format')) ?? 'json';

  try {
    const rows = await queryLeadEvents({
      from: normalizeParam(params.get('from')),
      to: normalizeParam(params.get('to')),
      eventType: normalizeParam(params.get('event_type')),
      cityClassification: normalizeParam(params.get('city_classification')),
      source: normalizeParam(params.get('source')),
      campaign: normalizeParam(params.get('campaign')),
      limit: parseLimit(params.get('limit')),
      offset: parseOffset(params.get('offset')),
    });

    if (format === 'csv') {
      return new NextResponse(leadRowsToCsv(rows), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    if (format !== 'json') {
      return NextResponse.json(
        { ok: false, error: { code: 'UNSUPPORTED_FORMAT' } },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: true, count: rows.length, rows },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[santi_lead_export] FAILURE:', { message });
    return NextResponse.json(
      { ok: false, error: { code: 'EXPORT_ERROR', message } },
      { status: 500 },
    );
  }
}
