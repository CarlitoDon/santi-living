'use client';

import { CalculatorProvider } from '@/contexts/CalculatorContext';
import { LocaleProvider } from '@/contexts/locale';
import { HashScrollHandler } from '@/components/ui/HashScrollHandler';
import type { ReactNode } from 'react';
import type { Locale } from '@/contexts/locale';
import dynamic from 'next/dynamic';

const GlobalMapPicker = dynamic(
  () => import('@/components/calculator/MapPicker').then((mod) => mod.MapPicker),
  { ssr: false },
);

export function Providers({
  children,
  locale,
  dictionary,
}: {
  children: ReactNode;
  locale: Locale;
  dictionary: Record<string, unknown>;
}) {
  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <CalculatorProvider>
        <HashScrollHandler />
        {children}
        <GlobalMapPicker />
      </CalculatorProvider>
    </LocaleProvider>
  );
}
