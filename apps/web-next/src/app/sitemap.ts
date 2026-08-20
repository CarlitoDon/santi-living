import { MetadataRoute } from 'next';
import { getNotionPosts } from '@/lib/notion';
import { getAllPosts } from '@/lib/blog';

export const revalidate = 3600; // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://santiliving.com';

  // Static core routes
  const staticRoutes = [
    '',
    '/id',
    '/id/artikel',
    '/id/harga-sewa-kasur',
    '/id/sewa-kasur-terdekat',
    '/id/sewa-kasur-lipat',
    '/id/sewa-kasur-bulanan',
    '/id/sewa-extra-bed-jogja',
    '/id/sewa-karpet',
    '/id/sewa-karpet-jogja',
    '/id/sewa-karpet-merah-jogja',
    '/id/sewa-karpet-permadani-jogja',
    '/id/sewa-bantal-jogja',
    '/id/sewa-selimut-jogja',
    '/id/sewa-cooling',
    '/id/sewa-kipas-angin',
    '/id/sewa-tv',
    '/id/sewa-perlengkapan-event',
    '/id/about',
    '/id/pesan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' || route === '/id' ? 1.0 : 0.8,
  }));

  // Fetch dynamic articles from Notion DB & Local MD
  let dynamicArticles: MetadataRoute.Sitemap = [];
  try {
    const [notionPosts, mdPosts] = await Promise.all([
      getNotionPosts().catch(() => []),
      Promise.resolve(getAllPosts('id')).catch(() => []),
    ]);

    const seenSlugs = new Set<string>();
    const allPosts = [...notionPosts, ...mdPosts];

    dynamicArticles = allPosts
      .filter((post) => {
        if (!post.slug || seenSlugs.has(post.slug)) return false;
        seenSlugs.add(post.slug);
        return true;
      })
      .map((post) => {
        const rawDate =
          'date' in post && typeof post.date === 'string'
            ? post.date
            : 'frontmatter' in post && post.frontmatter && typeof (post.frontmatter as { date?: string }).date === 'string'
              ? (post.frontmatter as { date?: string }).date
              : undefined;
        return {
          url: `${baseUrl}/id/artikel/${post.slug}`,
          lastModified: rawDate ? new Date(rawDate) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Failed to generate dynamic sitemap entries for blog:', error);
  }

  return [...staticRoutes, ...dynamicArticles];
}
