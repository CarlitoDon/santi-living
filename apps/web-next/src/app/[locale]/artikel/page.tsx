import type { Metadata } from 'next';
import { getNotionPosts } from '@/lib/notion';
import { getDictionary, type Locale } from '@/locales/dictionary';
import { localeHref } from '@/utils/localeHref';
import { PageHero } from '@/components/layout/PageHero';
import { ArticleLoadMore, type ArticleListItem } from '@/components/blog/ArticleLoadMore';

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
export const revalidate = 21600;

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
  const articleList: ArticleListItem[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    dateLabel: new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    href: localeHref(`/artikel/${post.slug}`, locale),
  }));

  return (
    <main className="site-main-offset">
      <PageHero title={blogDict.page_title} subtitle={blogDict.page_desc} />

      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {posts.length === 0 ? (
              <p className="text-center text-slate-400" data-reveal="fade">{blogDict.empty}</p>
            ) : (
              <ArticleLoadMore posts={articleList} locale={locale} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
