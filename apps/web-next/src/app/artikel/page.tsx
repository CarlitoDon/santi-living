import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Artikel & Tips Sewa Kasur | Santi Living',
  description:
    'Panduan lengkap seputar sewa kasur, tips memilih kasur busa berkualitas, dan informasi layanan rental kasur harian/bulanan di Jogja.',
  alternates: {
    canonical: 'https://santiliving.com/artikel',
  },
  openGraph: {
    title: 'Artikel & Tips Sewa Kasur Jogja - Santi Living',
    description: 'Panduan lengkap seputar sewa kasur dan tips tidur nyaman di Yogyakarta.',
    url: 'https://santiliving.com/artikel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikel & Tips Sewa Kasur Jogja',
    description: 'Panduan lengkap seputar sewa kasur dan tips tidur nyaman.',
  },
};

export default function ArtikelIndexPage() {
  const posts = getAllPosts();

  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        padding: 'var(--space-8) 0',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: 'var(--space-2)' }}>Artikel &amp; Tips</h1>
          <p style={{ opacity: 0.9 }}>Panduan lengkap seputar sewa kasur dan tips tidur nyaman</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Belum ada artikel.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/artikel/${post.slug}`}
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
                    <span>{post.frontmatter.pubDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
