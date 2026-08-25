'use client';

import { useState } from 'react';
import Link from 'next/link';

const BATCH_SIZE = 10;

export interface ArticleListItem {
  slug: string;
  title: string;
  description: string;
  dateLabel: string;
  href: string;
}

interface ArticleLoadMoreProps {
  posts: ArticleListItem[];
  locale: string;
}

interface ArticleRowProps {
  post: ArticleListItem;
  locale: string;
}

function ArticleRow({ post, locale }: ArticleRowProps) {
  return (
    <Link
      href={post.href}
      className="group block border-b border-slate-200 p-5 last:border-b-0 hover:bg-slate-50 motion-interactive md:p-6"
    >
      <h2 className="mb-2 text-lg font-bold text-slate-900 motion-interactive group-hover:text-blue-700">
        {post.title}
      </h2>
      <p className="mb-3 text-sm leading-relaxed text-slate-600">
        {post.description}
      </p>
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>{post.dateLabel}</span>
        <span
          className="-translate-x-1 text-blue-600 opacity-0 motion-interactive group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden="true"
        >
          {locale === 'en' ? 'Read' : 'Baca'} →
        </span>
      </div>
    </Link>
  );
}

export function ArticleLoadMore({ posts, locale }: ArticleLoadMoreProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const clampedVisibleCount = Math.min(visibleCount, posts.length);
  const remainingCount = posts.length - clampedVisibleCount;
  const nextBatchCount = Math.min(BATCH_SIZE, remainingCount);
  const visiblePosts = posts.slice(0, clampedVisibleCount);

  const statusLabel = locale === 'en'
    ? `Showing ${clampedVisibleCount} of ${posts.length} articles`
    : `Menampilkan ${clampedVisibleCount} dari ${posts.length} artikel`;
  const buttonLabel = locale === 'en'
    ? `Show ${nextBatchCount} more articles`
    : `Tampilkan ${nextBatchCount} artikel lagi`;

  return (
    <div data-reveal="up">
      <div
        id="article-list"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        {visiblePosts.map((post) => (
          <ArticleRow key={post.slug} post={post} locale={locale} />
        ))}
        <noscript>
          {posts.slice(BATCH_SIZE).map((post) => (
            <ArticleRow key={post.slug} post={post} locale={locale} />
          ))}
        </noscript>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm text-slate-500" aria-live="polite">
          {statusLabel}
        </p>
        {remainingCount > 0 ? (
          <button
            type="button"
            className="min-h-12 rounded-full border border-slate-900 bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-sm motion-interactive hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-controls="article-list"
            data-testid="article-load-more"
            onClick={() => setVisibleCount((count) => count + BATCH_SIZE)}
          >
            {buttonLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
