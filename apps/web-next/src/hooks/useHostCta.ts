'use client';

import { useMemo } from 'react';
import { DEFAULT_HOST_CTA, getHostCta, type HostCtaCopy } from '@/utils/hostCta';
import { useLocale } from '@/contexts/locale';

export function useHostCta(): HostCtaCopy {
  const { locale } = useLocale();

  const cta = useMemo(() => {
    return getHostCta(window.location.hostname, window.location.pathname, locale);
  }, [locale]);

  return cta || DEFAULT_HOST_CTA;
}
