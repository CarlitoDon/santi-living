'use client';

import { useEffect } from 'react';
import { captureAttributionOnPageLoad } from '@/lib/attribution';

export function AttributionCapture() {
  useEffect(() => {
    captureAttributionOnPageLoad();
  }, []);

  return null;
}
