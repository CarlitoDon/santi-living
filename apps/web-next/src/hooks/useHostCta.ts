'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_HOST_CTA, getHostCta, type HostCtaCopy } from '@/utils/hostCta';
import { useLocale } from '@/contexts/locale';

export function useHostCta(): HostCtaCopy {
  const { locale } = useLocale();
  const [cta, setCta] = useState<HostCtaCopy>(DEFAULT_HOST_CTA);

  useEffect(() => {
    // Keep the server and first client render identical, then specialize the CTA.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCta(getHostCta(window.location.hostname, window.location.pathname, locale));
  }, [locale]);

  return cta;
}
