import type { Metadata } from 'next';
import Link from 'next/link';
import { getNotionPosts } from '@/lib/notion';
import { getDictionary, type Locale } from '@/locales/dictionary';
import { localeHref } from '@/utils/localeHref';
import { PageHero } from '@/components/layout/PageHero';

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface BlogDict {
  page_title: string;
  page_desc: string;
  empty: string;
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

export const dynamicParams = true;
export const revalidate = 60;

export default async function ArtikelIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const rawDict = await getDictionary(locale as Locale);
  const dict = rawDict as Record<string, unknown>;
  const posts = await getNotionPosts();

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const blogDict = (dict.blog as BlogDict) || {
    page_title: 'Artikel & Tips',
    page_desc: 'Panduan lengkap seputar sewa kasur dan tips tidur nyaman',
    empty: 'Belum ada artikel.',
  };

  return (
    <main className="site-main-offset">
      <PageHero title={blogDict.page_title} subtitle={blogDict.page_desc} />

      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {posts.length === 0 ? (
            <p className="text-center text-slate-400" data-reveal="fade">{blogDict.empty}</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={localeHref(`/artikel/${post.slug}`, locale)}
                  className="group block border-b border-slate-200 p-5 last:border-b-0 hover:bg-slate-50 motion-interactive md:p-6"
                  data-reveal="up"
                  data-reveal-delay={String((index % 4) * 40)}
                >
                  <h2 className="mb-2 text-lg font-bold text-slate-900 motion-interactive group-hover:text-blue-700">
                    {post.title}
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>
                      {new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-blue-600 opacity-0 -translate-x-1 motion-interactive group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
                      {locale === 'en' ? 'Read' : 'Baca'} →
                    </span>
                  </div>
                </Link>
              ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
