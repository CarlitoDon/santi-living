'use client';

import { CalculatorProvider } from '@/contexts/CalculatorContext';
import { LocaleProvider } from '@/contexts/locale';
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
      <CalculatorProvider>{children}</CalculatorProvider>
    </LocaleProvider>
  );
}
