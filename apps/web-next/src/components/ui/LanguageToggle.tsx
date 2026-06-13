'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/locale';

const locales = [
  { code: 'id', label: 'ID' },
  { code: 'en', label: 'EN' },
] as const;

export function LanguageToggle() {
  const pathname = usePathname();
  const { locale } = useLocale();

  // Strip current locale prefix to get base path
  const base = pathname.replace(/^\/(id|en)(\/|$)/, '/');

  return (
    <div className="flex items-center gap-1 text-xs font-semibold mr-2">
      {locales.map((lang, i) => (
        <span key={lang.code} className="flex items-center">
          {i > 0 && <span className="text-slate-300 mx-1">|</span>}
          {lang.code === locale ? (
            <span className="text-blue-600 cursor-default">{lang.label}</span>
          ) : (
            <Link
              href={`/${lang.code}${base === '/' ? '' : base}`}
              className="text-slate-400 hover:text-blue-600 no-underline transition-colors"
            >
              {lang.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
