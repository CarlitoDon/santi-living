'use client';

import { CalculatorProvider } from '@/contexts/CalculatorContext';
import { LocaleProvider } from '@/contexts/locale';
import { HashScrollHandler } from '@/components/ui/HashScrollHandler';
import type { ReactNode } from 'react';
import type { Locale } from '@/contexts/locale';

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
      </CalculatorProvider>
    </LocaleProvider>
  );
}
