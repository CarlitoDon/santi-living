import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAllPosts: vi.fn(),
  getNotionPost: vi.fn(),
  getNotionPosts: vi.fn(),
  getPostBySlug: vi.fn(),
}));

vi.mock('@/lib/blog', () => ({
  getAllPosts: mocks.getAllPosts,
  getPostBySlug: mocks.getPostBySlug,
}));
vi.mock('@/lib/notion', () => ({
  getNotionPost: mocks.getNotionPost,
  getNotionPosts: mocks.getNotionPosts,
}));
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

import ArtikelSlugPage, { dynamicParams, generateMetadata, generateStaticParams, revalidate } from './page';

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

  it('renders conversion CTA with internal links at the end of the article', async () => {
    mocks.getPostBySlug.mockReturnValue({
      slug: 'test-article',
      frontmatter: {
        title: 'Test Article',
        description: 'Test description',
        pubDate: new Date(2026, 0, 1),
      },
      content: '<p>Content</p>',
    });

    const page = await ArtikelSlugPage({
      params: Promise.resolve({ locale: 'id', slug: 'test-article' }),
    });

    const stringified = JSON.stringify(page);
    expect(stringified).toContain('https://santiliving.com/id/#calculator');
    expect(stringified).toContain('https://santiliving.com/id/harga-sewa-kasur');
    expect(stringified).toContain('https://wa.me/6289519119092');
  });

  it('sets robots noindex follow for English local markdown posts and index follow for others', async () => {
    mocks.getPostBySlug.mockImplementation((slug: string, locale: string) => {
      if (slug === 'en-local-article' && locale === 'en') {
        return {
          slug: 'en-local-article',
          frontmatter: {
            title: 'EN Local Article',
            description: 'Local EN description',
            pubDate: new Date(2026, 0, 1),
          },
          content: 'Content',
        };
      }
      if (slug === 'id-local-article' && locale === 'id') {
        return {
          slug: 'id-local-article',
          frontmatter: {
            title: 'ID Local Article',
            description: 'Local ID description',
            pubDate: new Date(2026, 0, 1),
          },
          content: 'Content',
        };
      }
      return undefined;
    });
    mocks.getNotionPost.mockImplementation((slug: string) => {
      if (slug === 'en-notion-article') {
        return Promise.resolve({
          id: 'notion-en',
          slug: 'en-notion-article',
          title: 'EN Notion Article',
          date: '2026-01-01',
          description: 'Notion description',
          category: 'Tips',
        });
      }
      return Promise.resolve(null);
    });

    const enLocalMeta = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'en-local-article' }),
    });
    expect(enLocalMeta.robots).toEqual({ index: false, follow: true });

    const idLocalMeta = await generateMetadata({
      params: Promise.resolve({ locale: 'id', slug: 'id-local-article' }),
    });
    expect(idLocalMeta.robots).toEqual({ index: true, follow: true });

    const enNotionMeta = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'en-notion-article' }),
    });
    expect(enNotionMeta.robots).toEqual({ index: true, follow: true });
  });
});
