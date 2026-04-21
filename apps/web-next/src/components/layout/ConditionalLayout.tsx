'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const MINIMAL_ROUTES = ['/pesan'];

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
  const isMinimal = MINIMAL_ROUTES.some((r) => pathname.startsWith(r));

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
