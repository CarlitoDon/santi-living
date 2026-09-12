/**
 * @vitest-environment jsdom
 */
import { cleanup, render } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@/contexts/locale';
import SewaAcaraPage from '../sewa-perlengkapan-event/page';
import SewaKarpetJogjaPage from './page';

vi.mock('next/link', () => ({
  default: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}));

const dictionary = { landing: {} };

function renderWithLocale(children: ReactNode) {
  return render(
    <LocaleProvider locale="id" dictionary={dictionary}>
      {children}
    </LocaleProvider>,
  );
}

afterEach(() => {
  cleanup();
});

describe('landing conversion metadata', () => {
  it('emits explicit carpet metadata on the /id/sewa-karpet-jogja WhatsApp links', async () => {
    const page = await SewaKarpetJogjaPage({
      params: Promise.resolve({ locale: 'id' }),
    });
    const { container } = renderWithLocale(page);
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[data-wa-source]'));

    expect(links).toHaveLength(2);
    expect(links.map((link) => link.dataset.waSource)).toEqual([
      'carpet_page_hero',
      'carpet_page_footer',
    ]);
    for (const link of links) {
      expect(link.dataset.productCategory).toBe('karpet');
      expect(link.dataset.pageType).toBe('money_page');
      expect(link.dataset.waIntent).toBe('sewa_karpet_jogja');
    }
  });

  it('emits explicit event metadata on the /id/sewa-perlengkapan-event WhatsApp CTA', () => {
    const { container } = renderWithLocale(<SewaAcaraPage />);
    const link = container.querySelector<HTMLAnchorElement>(
      'a[data-wa-source="acara_santiliving_page"]',
    );

    expect(link).not.toBeNull();
    expect(link?.dataset.productCategory).toBe('event');
    expect(link?.dataset.pageType).toBe('landing');
    expect(link?.dataset.waIntent).toBe('paket_perlengkapan_acara');
  });
});
