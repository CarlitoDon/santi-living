import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { getDictionary, type Locale } from '@/locales/dictionary';
import { localeHref } from '@/utils/localeHref';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  
  return {
    title: `${dict.blog?.page_title || 'Artikel & Tips'} | Santi Living`,
    description: dict.blog?.page_desc || 'Panduan lengkap seputar sewa kasur dan tips tidur nyaman.',
    alternates: {
      canonical: `https://santiliving.com${locale === 'en' ? '/en' : ''}/artikel`,
    },
    openGraph: {
      title: `${dict.blog?.page_title || 'Artikel & Tips'} - Santi Living`,
      description: dict.blog?.page_desc || 'Panduan lengkap seputar sewa kasur.',
      url: `https://santiliving.com${locale === 'en' ? '/en' : ''}/artikel`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.blog?.page_title || 'Artikel & Tips'} - Santi Living`,
      description: dict.blog?.page_desc || 'Panduan lengkap seputar sewa kasur.',
    },
  };
}

export default async function ArtikelIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const rawDict = await getDictionary(locale as Locale);
  const dict = rawDict as Record<string, unknown>;
  const posts = getAllPosts(locale);

  const blogDict = dict.blog || {
    page_title: 'Artikel & Tips',
    page_desc: 'Panduan lengkap seputar sewa kasur dan tips tidur nyaman',
    empty: 'Belum ada artikel.',
  };

  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        padding: 'var(--space-8) 0',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: 'var(--space-2)' }}>{blogDict.page_title}</h1>
          <p style={{ opacity: 0.9 }}>{blogDict.page_desc}</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{blogDict.empty}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={localeHref(`/artikel/${post.slug}`, locale)}
                  style={{
                    display: 'block',
                    padding: 'var(--space-5)',
                    background: 'white',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    textDecoration: 'none',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                >
                  <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                    {post.frontmatter.title}
                  </h2>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    {post.frontmatter.description}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    <span>
                      {post.frontmatter.pubDate.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span>• {post.frontmatter.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
