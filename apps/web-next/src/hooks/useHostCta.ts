'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_HOST_CTA, getHostCta, type HostCtaCopy } from '@/utils/hostCta';

export function useHostCta(): HostCtaCopy {
  const [cta, setCta] = useState<HostCtaCopy>(DEFAULT_HOST_CTA);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCta(getHostCta(window.location.hostname, window.location.pathname));
  }, []);

  return cta;
}
