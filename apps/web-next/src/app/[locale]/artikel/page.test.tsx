import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArtikelIndexPage from './page';

const mocks = vi.hoisted(() => ({
  getAllPosts: vi.fn(),
  getNotionPosts: vi.fn(),
}));

vi.mock('@/lib/blog', () => ({
  getAllPosts: mocks.getAllPosts,
}));

vi.mock('@/lib/notion', () => ({
  getNotionPosts: mocks.getNotionPosts,
}));

vi.mock('@/locales/dictionary', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    blog: {
      page_title: 'Artikel & Tips',
      page_desc: 'Panduan sewa kasur',
      empty: 'Belum ada artikel.',
    },
  }),
}));

describe('ArtikelIndexPage', () => {
  beforeEach(() => {
    mocks.getAllPosts.mockReset();
    mocks.getNotionPosts.mockReset();
  });

  it('merges notion and local posts, deduplicating by slug in favor of Notion, sorted by date descending', async () => {
    mocks.getNotionPosts.mockResolvedValue([
      {
        id: 'notion-1',
        slug: 'shared-post',
        title: 'Notion Version of Shared Post',
        description: 'Notion description',
        date: '2026-05-10',
        category: 'Tips',
      },
      {
        id: 'notion-2',
        slug: 'older-notion-post',
        title: 'Older Notion Post',
        description: 'Older notion desc',
        date: '2026-01-01',
        category: 'Panduan',
      },
    ]);

    mocks.getAllPosts.mockReturnValue([
      {
        slug: 'shared-post',
        frontmatter: {
          title: 'Local Version of Shared Post (Should Be Deduplicated)',
          description: 'Local desc',
          pubDate: new Date('2026-05-09T00:00:00.000Z'),
          tags: ['Tips'],
        },
        content: '',
      },
      {
        slug: 'newest-local-post',
        frontmatter: {
          title: 'Newest Local Post',
          description: 'Newest local desc',
          pubDate: new Date('2026-06-01T00:00:00.000Z'),
          tags: ['Sewa'],
        },
        content: '',
      },
    ]);

    const pageElement = await ArtikelIndexPage({
      params: Promise.resolve({ locale: 'id' }),
    });

    const stringified = JSON.stringify(pageElement);

    // 1. Newest local post (2026-06-01) should appear
    expect(stringified).toContain('Newest Local Post');

    // 2. Notion version of shared post (2026-05-10) should appear, not local version
    expect(stringified).toContain('Notion Version of Shared Post');
    expect(stringified).not.toContain('Local Version of Shared Post (Should Be Deduplicated)');

    // 3. Older notion post should appear
    expect(stringified).toContain('Older Notion Post');

    // Check ordering in serialized output: Newest Local Post -> Notion Version -> Older Notion Post
    const idxNewest = stringified.indexOf('Newest Local Post');
    const idxShared = stringified.indexOf('Notion Version of Shared Post');
    const idxOlder = stringified.indexOf('Older Notion Post');

    expect(idxNewest).toBeLessThan(idxShared);
    expect(idxShared).toBeLessThan(idxOlder);
  });
});
