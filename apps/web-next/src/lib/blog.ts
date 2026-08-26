import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogFrontmatterSchema, type BlogPost } from '@/types/blog';

const BLOG_DIR_ID = path.join(process.cwd(), 'src/content/blog/id');
const BLOG_DIR_EN = path.join(process.cwd(), 'src/content/blog/en');
const postsCache = new Map<'id' | 'en', BlogPost[]>();

function normalizeLocale(locale: string): 'id' | 'en' {
  return locale === 'en' ? 'en' : 'id';
}

function getBlogDir(locale: 'id' | 'en'): string {
  return locale === 'en' ? BLOG_DIR_EN : BLOG_DIR_ID;
}

function parsePostFile(filePath: string, slug: string): BlogPost | null {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const parsed = BlogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.warn(`[Blog] Invalid frontmatter in ${path.basename(filePath)}:`, parsed.error.message);
    return null;
  }
  return { slug, frontmatter: parsed.data, content };
}

export function getAllPosts(locale: string = 'id'): BlogPost[] {
  const normalizedLocale = normalizeLocale(locale);
  const cached = postsCache.get(normalizedLocale);
  if (cached) return cached;

  const targetDir = getBlogDir(normalizedLocale);
  if (!fs.existsSync(targetDir)) return [];

  const files = fs.readdirSync(targetDir).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(targetDir, filename);
      return parsePostFile(filePath, slug);
    })
    .filter((post): post is BlogPost => post !== null);

  const sorted = posts.sort((a, b) => b.frontmatter.pubDate.getTime() - a.frontmatter.pubDate.getTime());
  postsCache.set(normalizedLocale, sorted);
  return sorted;
}

export function getPostBySlug(slug: string, locale: string = 'id'): BlogPost | undefined {
  if (!/^[a-z0-9-]+$/i.test(slug)) return undefined;
  const normalizedLocale = normalizeLocale(locale);
  const cached = postsCache.get(normalizedLocale);
  if (cached) return cached.find((post) => post.slug === slug);

  const filePath = path.join(getBlogDir(normalizedLocale), `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return parsePostFile(filePath, slug) || undefined;
}
