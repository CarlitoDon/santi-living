'use client';

import { useAutoLocation } from '@/hooks/useAutoLocation';

/**
 * Client Component wrapper to trigger auto-location logic.
 * This is needed because the main page is a Server Component.
 */
export function AutoLocationTrigger() {
  useAutoLocation();
  return null; // Side-effect only component
}
