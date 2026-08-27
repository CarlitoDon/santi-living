import { MetadataRoute } from 'next';
import { getNotionPosts } from '@/lib/notion';
import { getAllPosts } from '@/lib/blog';

export const revalidate = 86400;

const BASE_URL = 'https://santiliving.com';
const LOCALES = ['id', 'en'] as const;
const STATIC_PATHS = [
  '',
  'artikel',
  'harga-sewa-kasur',
  'sewa-kasur-terdekat',
  'sewa-kasur-lipat',
  'sewa-kasur-bulanan',
  'sewa-extra-bed-jogja',
  'sewa-karpet',
  'sewa-karpet-jogja',
  'sewa-karpet-merah-jogja',
  'sewa-karpet-permadani-jogja',
  'sewa-bantal-jogja',
  'sewa-selimut-jogja',
  'sewa-cooling',
  'sewa-kipas-angin',
  'sewa-tv',
  'sewa-perlengkapan-event',
  'produk',
  'about',
  'pesan',
] as const;

function safeDate(value: Date | string | undefined): Date {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function localizedAlternates(path: string) {
  return {
    languages: {
      id: `${BASE_URL}/id${path}`,
      en: `${BASE_URL}/en${path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: localizedAlternates(''),
    },
    ...LOCALES.flatMap((locale) => STATIC_PATHS.map((path) => ({
      url: `${BASE_URL}/${locale}${path ? `/${path}` : ''}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: path ? 0.8 : 1,
      alternates: localizedAlternates(path ? `/${path}` : ''),
    }))),
  ];

  try {
    const [notionPosts, idPosts, enPosts] = await Promise.all([
      getNotionPosts().catch(() => []),
      Promise.resolve(getAllPosts('id')),
      Promise.resolve(getAllPosts('en')),
    ]);
    const seen = new Set<string>();
    const articleRoutes: MetadataRoute.Sitemap = [];

    const addArticle = (locale: 'id' | 'en', slug: string, date?: Date | string) => {
      const key = `${locale}:${slug}`;
      if (!slug || seen.has(key)) return;
      seen.add(key);
      const path = `/artikel/${slug}`;
      articleRoutes.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: safeDate(date),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: localizedAlternates(path),
      });
    };

    for (const post of notionPosts) {
      for (const locale of LOCALES) addArticle(locale, post.slug, post.date);
    }
    for (const post of idPosts) addArticle('id', post.slug, post.frontmatter.pubDate);
    for (const post of enPosts) addArticle('en', post.slug, post.frontmatter.pubDate);

    return [...staticRoutes, ...articleRoutes];
  } catch (error) {
    console.error('Failed to generate dynamic sitemap entries for blog:', error);
    return staticRoutes;
  }
}
