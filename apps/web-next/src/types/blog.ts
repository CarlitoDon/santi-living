import { z } from 'zod';

export const BlogFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string().default('Tim Santi Mebel'),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}
