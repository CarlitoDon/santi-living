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
});
