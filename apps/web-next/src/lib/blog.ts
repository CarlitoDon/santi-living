import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogFrontmatterSchema, type BlogPost } from '@/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(BLOG_DIR, filename);
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

  // Sort by date descending
  return posts.sort((a, b) => b.frontmatter.pubDate.getTime() - a.frontmatter.pubDate.getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
