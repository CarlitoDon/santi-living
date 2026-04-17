'use client';

import Link from 'next/link';
import { config } from '@/data/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* NAP Section for Local SEO */}
          <div className="footer-nap">
            <h3 className="footer-brand">{config.businessName}</h3>
            <address className="footer-address">
              <p>
                <span className="footer-icon">📍</span>
                Jl. Godean KM 10, Godean<br />
                Yogyakarta 55182, Indonesia
              </p>
              <p>
                <span className="footer-icon">📞</span>
                <a href={`tel:+${config.whatsappNumber}`}>{config.whatsappDisplay}</a>
              </p>
              <p>
                <span className="footer-icon">⏰</span>
                Senin - Minggu: 07:00 - 21:00 WIB
              </p>
            </address>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Layanan Kami</h4>
            <ul>
              <li><Link href="/produk">Katalog Produk</Link></li>
              <li><Link href="/harga-sewa-kasur">Harga Sewa Busa</Link></li>
              <li><Link href="/sewa-kasur-terdekat">Sewa Kasur Terdekat</Link></li>
              <li><Link href="/sewa-kasur-lipat">Sewa Kasur Lipat</Link></li>
              <li><Link href="/sewa-kasur-bulanan">Sewa Kasur Bulanan</Link></li>
              <li><Link href="/artikel">Artikel &amp; Tips</Link></li>
              <li><Link href="/about">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-social">
            <h4>Ikuti Kami</h4>
            <div className="social-links">
              <a href="https://www.instagram.com/santi.mebel/" target="_blank" rel="noopener" aria-label="Instagram">📷</a>
              <a href="https://www.tiktok.com/@santi_mebel" target="_blank" rel="noopener" aria-label="TikTok">🎵</a>
              <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {config.businessName}. Semua hak dilindungi.</p>
          <p className="footer-tagline">Layanan Sewa Kasur Busa Terpercaya di Yogyakarta</p>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background: var(--color-gray-900, #0f172a);
          color: white;
          padding: var(--space-12) 0 var(--space-6);
          margin-top: var(--space-4);
        }
        .footer-grid {
          display: grid;
          gap: var(--space-8);
          margin-bottom: var(--space-8);
        }
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
        .footer-brand {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-4);
          color: white;
        }
        .footer-address {
          font-style: normal;
          color: #94a3b8;
          line-height: 1.8;
        }
        .footer-address p {
          margin-bottom: var(--space-2);
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
        }
        .footer-icon { flex-shrink: 0; }
        .footer-address a { color: #94a3b8; text-decoration: none; }
        .footer-address a:hover { color: white; }
        .footer-links h4, .footer-social h4 {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-4);
          color: white;
        }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: var(--space-2); }
        .footer-links a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: white; }
        .social-links { display: flex; gap: var(--space-3); }
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #1e293b;
          border-radius: var(--radius-full);
          font-size: 1.2rem;
          transition: background 0.2s;
        }
        .social-links a:hover { background: var(--color-primary); }
        .footer-bottom {
          border-top: 1px solid #1e293b;
          padding-top: var(--space-6);
          text-align: center;
          color: #64748b;
          font-size: var(--font-size-sm);
        }
        .footer-bottom p { margin-bottom: var(--space-1); }
        .footer-tagline { font-size: var(--font-size-xs); }
      `}</style>
    </footer>
  );
}
