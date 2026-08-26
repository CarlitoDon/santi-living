/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { unstable_cache } from 'next/cache';

const NOTION_CACHE_SECONDS = 6 * 60 * 60;

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

  return allResults.map((page: any) => {
    const coverUrl = page.cover?.external?.url || page.cover?.file?.url || getPropertyText(page.properties['Featured Image']) || getPropertyText(page.properties['Image']) || undefined;

    return {
      id: page.id,
      title: getPropertyText(page.properties.Name),
      slug: getPropertyText(page.properties.Slug) || page.id,
      date: getPropertyText(page.properties['Published Date']) || page.created_time,
      description: getPropertyText(page.properties['Meta Description']),
      category: getPropertyText(page.properties.Category) || 'Tips',
      image: coverUrl,
    };
  });
}

const getCachedNotionPosts = unstable_cache(
  queryNotionPosts,
  ['notion-blog-posts-v2'],
  { revalidate: NOTION_CACHE_SECONDS, tags: ['notion-blog'] },
);

export async function getNotionPosts(): Promise<NotionPost[]> {
  return getCachedNotionPosts();
}

const getCachedNotionPost = unstable_cache(async (slug: string): Promise<NotionPost | null> => {
  const posts = await getNotionPosts();
  const postInfo = posts.find(p => p.slug === slug);
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
}, ['notion-blog-post-v2'], {
  revalidate: NOTION_CACHE_SECONDS,
  tags: ['notion-blog'],
});

export async function getNotionPost(slug: string): Promise<NotionPost | null> {
  return getCachedNotionPost(slug);
}
