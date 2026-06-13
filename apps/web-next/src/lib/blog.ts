import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogFrontmatterSchema, type BlogPost } from '@/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export function getAllPosts(locale: string = 'id'): BlogPost[] {
  const targetDir = path.join(BLOG_DIR, locale === 'en' ? 'en' : 'id');
  if (!fs.existsSync(targetDir)) return [];

  const files = fs.readdirSync(targetDir).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(targetDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const parsed = BlogFrontmatterSchema.safeParse(data);

      if (!parsed.success) {
        console.warn(`[Blog] Invalid frontmatter in ${filename}:`, parsed.error.message);
        return null;
      }

      return { slug, frontmatter: parsed.data, content };
    })
    .filter((post): post is BlogPost => post !== null);

  return posts.sort((a, b) => b.frontmatter.pubDate.getTime() - a.frontmatter.pubDate.getTime());
}

export function getPostBySlug(slug: string, locale: string = 'id'): BlogPost | undefined {
  return getAllPosts(locale).find((p) => p.slug === slug);
}
