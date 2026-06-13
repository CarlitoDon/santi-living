'use client';

import { createContext, useContext } from 'react';

export type Locale = 'id' | 'en';

interface LocaleContextValue {
  locale: Locale;
  t: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Record<string, unknown>;
  children: React.ReactNode;
}) {
  function t(path: string): string {
    const keys = path.split('.');
    let value: unknown = dictionary;
    for (const key of keys) {
      if (value == null || typeof value !== 'object') return path;
      value = (value as Record<string, unknown>)[key];
    }
    return typeof value === 'string' ? value : path;
  }

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export function useT() {
  return useLocale().t;
}
