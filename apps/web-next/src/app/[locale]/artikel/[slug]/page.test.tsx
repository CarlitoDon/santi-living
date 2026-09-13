import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAllPosts: vi.fn(),
  getNotionPosts: vi.fn(),
}));

vi.mock('@/lib/blog', () => ({
  getAllPosts: mocks.getAllPosts,
  getPostBySlug: vi.fn(),
}));
vi.mock('@/lib/notion', () => ({
  getNotionPost: vi.fn(),
  getNotionPosts: mocks.getNotionPosts,
}));
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

import { dynamicParams, generateStaticParams, revalidate } from './page';

describe('article prerender budget', () => {
  beforeEach(() => {
    mocks.getAllPosts.mockImplementation((locale: string) => Array.from({ length: 50 }, (_, index) => ({
      slug: `${locale}-local-${index}`,
      frontmatter: { pubDate: new Date(2026, 0, index + 1) },
      content: '',
    })));
    mocks.getNotionPosts.mockResolvedValue(Array.from({ length: 50 }, (_, index) => ({
      id: `notion-${index}`,
      slug: `notion-${index}`,
      title: `Notion ${index}`,
      date: new Date(2026, 0, index + 1).toISOString(),
      description: '',
      category: 'Tips',
    })));
  });

  it('prerenders only the newest local and Notion articles while keeping older URLs on demand', async () => {
    const params = await generateStaticParams();

    expect(dynamicParams).toBe(true);
    expect(revalidate).toBe(false);
    expect(params.filter(({ locale }) => locale === 'id')).toHaveLength(80);
    expect(params.filter(({ locale }) => locale === 'en')).toHaveLength(80);
    expect(params).toContainEqual({ locale: 'id', slug: 'id-local-49' });
    expect(params).not.toContainEqual({ locale: 'id', slug: 'id-local-0' });
    expect(params).toContainEqual({ locale: 'en', slug: 'notion-49' });
    expect(params).not.toContainEqual({ locale: 'en', slug: 'notion-0' });
  });
});
