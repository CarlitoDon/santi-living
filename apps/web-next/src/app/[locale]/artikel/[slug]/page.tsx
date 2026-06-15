import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { remark } from 'remark';
import html from 'remark-html';
import { getTranslatedAuthor } from '@/utils/author';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
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
  const post = getPostBySlug(slug, locale);
  if (!post) return { title: locale === 'en' ? 'Article Not Found' : 'Artikel Tidak Ditemukan' };
  
  const url = `https://santiliving.com${locale === 'en' ? '/en' : ''}/artikel/${slug}`;
  const image = post.frontmatter.image || 'https://santiliving.com/logo.png';

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      type: 'article',
      publishedTime: post.frontmatter.pubDate.toISOString(),
      authors: [getTranslatedAuthor(post.frontmatter.author, locale)],
      images: [
        {
          url: image,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
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
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const processedContent = await remark().use(html).process(post.content);
  const htmlContent = rewriteWhatsappLinks(processedContent.toString(), slug, locale);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.frontmatter.title,
    "description": post.frontmatter.description,
    "author": {
      "@type": "Person",
      "name": getTranslatedAuthor(post.frontmatter.author, locale)
    },
    "datePublished": post.frontmatter.pubDate.toISOString(),
    "image": post.frontmatter.image || "https://santiliving.com/logo.png",
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
              {post.frontmatter.title}
            </h1>
            <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              <span>
                {post.frontmatter.pubDate.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span>• {getTranslatedAuthor(post.frontmatter.author, locale)}</span>
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
