import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { type BlogPost as MarkdownPost } from '@/types/blog';
import { getNotionPost, type NotionPost } from '@/lib/notion';
import { remark } from 'remark';
import html from 'remark-html';
import { getTranslatedAuthor } from '@/utils/author';

export const dynamicParams = true;
export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface ArticlePost {
  slug: string;
  title: string;
  description: string;
  date?: Date;
  author: string;
  image: string;
  tags: string[];
  content: string;
}

function normalizePost(post: NotionPost | MarkdownPost | null | undefined): ArticlePost | null {
  if (!post) return null;
  if ('frontmatter' in post) {
    return {
      slug: post.slug,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      date: post.frontmatter.pubDate,
      author: post.frontmatter.author || 'Santi Living',
      image: post.frontmatter.image || 'https://santiliving.com/logo.png',
      tags: post.frontmatter.tags || [],
      content: post.content || '',
    };
  }
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date ? new Date(post.date) : undefined,
    author: 'Santi Living',
    image: post.featuredImage || 'https://santiliving.com/logo.png',
    tags: post.category ? [post.category] : [],
    content: post.content || '',
  };
}

function rewriteWhatsappLinks(htmlContent: string, slug: string, locale: string): string {
  return htmlContent.replace(/href="https:\/\/wa\.me\/(\d+)(\?[^"]*)?"/g, (match, phone: string, query = '') => {
    try {
      const sourceUrl = new URL(`https://wa.me/${phone}${query}`);
      const params = new URLSearchParams({
        to: phone,
        cta_source: 'blog_cta',
        landing_page: `${locale === 'en' ? '/en' : ''}/artikel/${slug}`,
        source: 'blog',
        medium: 'organic',
        campaign: slug,
      });
      const text = sourceUrl.searchParams.get('text');
      if (text) {
        params.set('text', text);
      }

      return `href="/api/wa?${params.toString()}"`;
    } catch {
      return match;
    }
  });
}

export async function generateStaticParams() {
  const locales = ['id', 'en'];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const rawPost = (await getNotionPost(slug)) || getPostBySlug(slug, locale);
  const post = normalizePost(rawPost);
  if (!post) return { title: locale === 'en' ? 'Article Not Found' : 'Artikel Tidak Ditemukan' };

  const url = `https://santiliving.com${locale === 'en' ? '/en' : ''}/artikel/${slug}`;
  const image = post.image;
  const title = post.title;
  const description = post.description;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      description: description,
      url,
      type: 'article',
      publishedTime: post.date?.toISOString(),
      authors: [getTranslatedAuthor(post.author, locale)],
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArtikelSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const rawPost = (await getNotionPost(slug)) || getPostBySlug(slug, locale);
  const post = normalizePost(rawPost);
  if (!post) notFound();

  const content = post.content || '';
  const processedContent = await remark().use(html).process(content);
  const htmlContent = rewriteWhatsappLinks(processedContent.toString(), slug, locale);

  const title = post.title;
  const description = post.description;
  const author = getTranslatedAuthor(post.author, locale);
  const pubDate = post.date;
  const image = post.image;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": pubDate?.toISOString(),
    "image": image,
    "publisher": {
      "@type": "Organization",
      "name": "Santi Living",
      "logo": {
        "@type": "ImageObject",
        "url": "https://santiliving.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://santiliving.com${locale === 'en' ? '/en' : ''}/artikel/${slug}`
    }
  };

  return (
    <main style={{ paddingTop: '70px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article style={{ padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <header style={{ marginBottom: 'var(--space-8)' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-3)' }}>
              {title}
            </h1>
            <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              <span>
                {pubDate?.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span>• {author}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                {post.tags.map((tag) => (
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

          {post.description && (
            <aside
              aria-label={locale === 'en' ? 'Quick Summary' : 'Ringkasan Cepat'}
              style={{
                marginBottom: 'var(--space-8)',
                padding: 'var(--space-5) var(--space-6)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>{locale === 'en' ? 'Quick Answer / Summary' : 'Ringkasan Jawaban'}</span>
              </div>
              <p
                style={{
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--color-text)',
                  fontWeight: 'var(--font-weight-medium)',
                  margin: 0,
                }}
              >
                {post.description}
              </p>
            </aside>
          )}

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
