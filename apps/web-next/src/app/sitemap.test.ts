import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getNotionPosts: vi.fn(),
  getAllPosts: vi.fn(),
}));

vi.mock('@/lib/notion', () => ({ getNotionPosts: mocks.getNotionPosts }));
vi.mock('@/lib/blog', () => ({ getAllPosts: mocks.getAllPosts }));

import sitemap, { revalidate } from './sitemap';

describe('sitemap cache stability', () => {
  beforeEach(() => {
    mocks.getNotionPosts.mockReset();
    mocks.getAllPosts.mockReset();
    mocks.getNotionPosts.mockResolvedValue([{
      id: 'notion-1',
      slug: 'panduan-notion',
      title: 'Panduan Notion',
      date: '2026-08-10',
      description: 'Artikel Notion',
      category: 'Tips',
    }]);
    mocks.getAllPosts.mockImplementation((locale: string) => [{
      slug: `panduan-${locale}`,
      frontmatter: { pubDate: new Date('2026-08-11T00:00:00.000Z') },
    }]);
  });

  it('is cached indefinitely until an on-demand content event', () => {
    expect(revalidate).toBe(false);
  });

  it('does not stamp static URLs with the request time', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-20T00:00:00.000Z'));
    const first = await sitemap();
    vi.setSystemTime(new Date('2026-08-29T00:00:00.000Z'));
    const second = await sitemap();
    vi.useRealTimers();

    expect(first).toEqual(second);
    const staticHomepage = first.find((entry) => entry.url === 'https://santiliving.com/id');
    expect(staticHomepage).not.toHaveProperty('lastModified');
    const article = first.find((entry) => entry.url.endsWith('/id/artikel/panduan-notion'));
    expect(article?.lastModified).toEqual(new Date('2026-08-10'));
  });

  it('uses only primary-domain URLs and locale alternates', async () => {
    const entries = await sitemap();
    const urls = entries.flatMap((entry) => [
      entry.url,
      ...(entry.alternates?.languages
        ? Object.values(entry.alternates.languages)
        : []),
    ]).filter((url): url is string => typeof url === 'string');

    expect(urls.every((url) => url.startsWith('https://santiliving.com'))).toBe(true);
    expect(entries.some((entry) => entry.url === 'https://santiliving.com')).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith('/pesan'))).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith('/sewa-karpet'))).toBe(false);
    expect(urls.some((url) => /(?:karpet|permadani|acara|kipas-angin)\.santiliving\.com/.test(url))).toBe(false);

    const chair = entries.find((entry) => entry.url === 'https://santiliving.com/id/sewa-kursi-acara');
    expect(chair?.alternates?.languages).toEqual({
      id: 'https://santiliving.com/id/sewa-kursi-acara',
      en: 'https://santiliving.com/en/sewa-kursi-acara',
    });
  });

  it('includes Notion posts and Indonesian local posts, but excludes English local posts', async () => {
    const entries = await sitemap();

    // Notion posts included for both id and en
    expect(entries.some((entry) => entry.url === 'https://santiliving.com/id/artikel/panduan-notion')).toBe(true);
    expect(entries.some((entry) => entry.url === 'https://santiliving.com/en/artikel/panduan-notion')).toBe(true);

    // Indonesian local posts included
    expect(entries.some((entry) => entry.url === 'https://santiliving.com/id/artikel/panduan-id')).toBe(true);

    // English local posts excluded to save crawl budget
    expect(entries.some((entry) => entry.url === 'https://santiliving.com/en/artikel/panduan-en')).toBe(false);
    expect(mocks.getAllPosts).toHaveBeenCalledWith('id');
    expect(mocks.getAllPosts).not.toHaveBeenCalledWith('en');
  });
});
