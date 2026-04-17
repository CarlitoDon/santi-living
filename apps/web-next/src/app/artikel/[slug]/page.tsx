import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { remark } from 'remark';
import html from 'remark-html';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan' };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function ArtikelSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const processedContent = await remark().use(html).process(post.content);
  const htmlContent = processedContent.toString();

  return (
    <main style={{ paddingTop: '70px' }}>
      <article style={{ padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <header style={{ marginBottom: 'var(--space-8)' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-3)' }}>
              {post.frontmatter.title}
            </h1>
            <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              <span>
                {post.frontmatter.pubDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span>• {post.frontmatter.author}</span>
            </div>
            {post.frontmatter.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      background: 'var(--color-primary-light)',
                      padding: '2px var(--space-3)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
            }}
          />
        </div>
      </article>

      <style>{`
        .prose h2 { font-size: var(--font-size-xl); margin-top: var(--space-8); margin-bottom: var(--space-4); color: var(--color-text); }
        .prose h3 { font-size: var(--font-size-lg); margin-top: var(--space-6); margin-bottom: var(--space-3); color: var(--color-text); }
        .prose p { margin-bottom: var(--space-4); }
        .prose ul, .prose ol { padding-left: var(--space-6); margin-bottom: var(--space-4); }
        .prose li { margin-bottom: var(--space-2); }
        .prose a { color: var(--color-primary); text-decoration: underline; }
        .prose strong { color: var(--color-text); font-weight: var(--font-weight-semibold); }
        .prose blockquote { border-left: 3px solid var(--color-primary); padding-left: var(--space-4); margin: var(--space-4) 0; color: var(--color-text-muted); font-style: italic; }
      `}</style>
    </main>
  );
}
