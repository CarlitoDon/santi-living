'use client';

import { useCallback, useEffect, useState } from 'react';
import { mainSiteHref, type BrowserLocationLike } from '@/utils/mainSiteHref';

export function useMainSiteHref(locale: string): (path: string) => string {
  const [location, setLocation] = useState<BrowserLocationLike | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocation({
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
    });
  }, []);

  return useCallback(
    (path: string) => mainSiteHref(path, locale, location),
    [locale, location],
  );
}
