'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const MINIMAL_PATTERN = /\/(?:pesan|lp-sewa-kursi-jogja)(?:\/|$)/;

export function ConditionalLayout({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isMinimal = MINIMAL_PATTERN.test(pathname ?? '');

  if (isMinimal) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <div style={{ flex: 1 }}>{children}</div>
      {footer}
    </>
  );
}
