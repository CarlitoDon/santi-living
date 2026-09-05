/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { unstable_cache } from 'next/cache';

export const NOTION_POSTS_TAG = 'notion-blog-posts-v3';
export const NOTION_POST_DETAILS_TAG = 'notion-blog-post-details-v3';

export function notionPostTag(slug: string): string {
  return `notion-blog-post-v3:${slug}`;
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export interface NotionPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  content?: string;
  category: string;
  featuredImage?: string;
  image?: string;
}

function getPropertyText(property: any): string {
  if (!property) return '';
  if (property.type === 'title') {
    return property.title.map((t: any) => t.plain_text).join('');
  }
  if (property.type === 'rich_text') {
    return property.rich_text.map((t: any) => t.plain_text).join('');
  }
  if (property.type === 'select') {
    return property.select?.name || '';
  }
  if (property.type === 'date') {
    return property.date?.start || '';
  }
  if (property.type === 'url') {
    return property.url || '';
  }
  return '';
}

async function queryNotionPosts(): Promise<NotionPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
  if (!databaseId) {
    console.warn('No NOTION_BLOG_DATABASE_ID found');
    return [];
  }

  const allResults: any[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const payload: any = {
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
      page_size: 100,
    };

    if (startCursor) {
      payload.start_cursor = startCursor;
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to query Notion DB', await response.text());
      break;
    }

    const data = await response.json();
    if (data.results) {
      allResults.push(...data.results);
    }

    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return allResults.map(mapNotionPage);
}

function mapNotionPage(page: any): NotionPost {
  // Prefer durable external URLs. Notion-hosted file URLs expire after about
  // one hour and must never be persisted in an indefinite cache entry.
  const coverUrl = page.cover?.external?.url
    || getPropertyText(page.properties['Featured Image'])
    || getPropertyText(page.properties['Image'])
    || undefined;

  return {
    id: page.id,
    title: getPropertyText(page.properties.Name),
    slug: getPropertyText(page.properties.Slug) || page.id,
    date: getPropertyText(page.properties['Published Date']) || page.created_time,
    description: getPropertyText(page.properties['Meta Description']),
    category: getPropertyText(page.properties.Category) || 'Tips',
    image: coverUrl,
  };
}

const getCachedNotionPosts = unstable_cache(
  queryNotionPosts,
  ['notion-blog-posts-v3'],
  { tags: [NOTION_POSTS_TAG] },
);

export async function getNotionPosts(): Promise<NotionPost[]> {
  return getCachedNotionPosts();
}

async function queryNotionPost(slug: string): Promise<NotionPost | null> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
  if (!databaseId) return null;

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Status', status: { equals: 'Published' } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    }),
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const data = await response.json() as { results?: any[] };
  const page = data.results?.[0];
  if (!page || !('properties' in page)) return null;
  const postInfo = mapNotionPage(page);
  if (!postInfo) return null;

  try {
    const mdblocks = await n2m.pageToMarkdown(postInfo.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
      ...postInfo,
      content: mdString.parent || '',
    };
  } catch (err) {
    console.error('Error fetching Notion markdown for page:', postInfo.id, err);
    return postInfo;
  }
}

export async function getNotionPost(slug: string): Promise<NotionPost | null> {
  const getCachedNotionPost = unstable_cache(
    () => queryNotionPost(slug),
    ['notion-blog-post-v3', slug],
    { tags: [NOTION_POST_DETAILS_TAG, notionPostTag(slug)] },
  );
  return getCachedNotionPost();
}

export async function getNotionSlugsForPage(pageId: string): Promise<string[]> {
  const slugs = new Set<string>();
  const cachedPost = (await getNotionPosts()).find((post) => post.id === pageId);
  if (cachedPost?.slug) slugs.add(cachedPost.slug);

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if ('properties' in page) {
      const currentSlug = getPropertyText(page.properties.Slug);
      if (currentSlug) slugs.add(currentSlug);
    }
  } catch {
    // Deleted or moved pages can no longer be retrieved. The cached slug above
    // still lets the webhook expire the old public route when available.
  }
  return [...slugs];
}
