import { timingSafeEqual } from 'node:crypto';

export function isLeadEventsAdminAuthorized(request: Pick<Request, 'headers'>): boolean {
  const expectedToken = process.env.LEAD_EVENTS_ADMIN_TOKEN;
  if (!expectedToken) return false;

  const authorization = request.headers.get('authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return false;

  const providedToken = authorization.slice('Bearer '.length);
  const expectedBytes = Buffer.from(expectedToken);
  const providedBytes = Buffer.from(providedToken);
  if (expectedBytes.length !== providedBytes.length) return false;

  return timingSafeEqual(expectedBytes, providedBytes);
}
