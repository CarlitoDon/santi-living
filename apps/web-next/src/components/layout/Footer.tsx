'use client';

import Link from 'next/link';
import { config } from '@/data/config';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6 mt-4">
      <div className="container">
        <div className="grid gap-8 mb-8 md:grid-cols-[2fr_1fr_1fr]">
          {/* NAP Section for Local SEO */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{config.businessName}</h3>
            <address className="not-italic text-slate-400 leading-[1.8]">
              <p className="mb-2 flex items-start gap-2">
                <span className="shrink-0">📍</span>
                <span>
                  Jl. Godean KM 10, Geneng RT 05/RW 04,<br />
                  Sidoagung, Godean, Sleman,<br />
                  DI Yogyakarta 55264
                </span>
              </p>
              <p className="mb-2">
                <a 
                  href="https://maps.google.com/maps?cid=5972493505984637593" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-light font-medium hover:underline text-sm"
                >
                  Buka di Google Maps →
                </a>
              </p>
              <p className="mb-2 flex items-start gap-2">
                <span className="shrink-0">📞</span>
                <a 
                  href={`tel:+${config.whatsappNumber}`} 
                  className="text-slate-400 no-underline hover:text-white transition-colors"
                >
                  {config.whatsappDisplay}
                </a>
              </p>
              <p className="mb-2 flex items-start gap-2">
                <span className="shrink-0">⏰</span>
                Senin - Minggu: 07:00 - 21:00 WIB
              </p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white">Layanan Kami</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2"><Link href="/produk" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Katalog Produk</Link></li>
              <li className="mb-2"><Link href="/harga-sewa-kasur" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Harga Sewa Busa</Link></li>
              <li className="mb-2"><Link href="/sewa-kasur-terdekat" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Sewa Kasur Terdekat</Link></li>
              <li className="mb-2"><Link href="/sewa-kasur-lipat" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Sewa Kasur Lipat</Link></li>
              <li className="mb-2"><Link href="/sewa-kasur-bulanan" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Sewa Kasur Bulanan</Link></li>
              <li className="mb-2"><Link href="/artikel" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Artikel &amp; Tips</Link></li>
              <li className="mb-2"><Link href="/about" className="text-slate-400 no-underline transition-colors duration-200 hover:text-white">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/santi.mebel/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-[1.2rem] transition-colors duration-200 hover:bg-blue-600 no-underline">📷</a>
              <a href="https://www.tiktok.com/@santi_mebel" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-[1.2rem] transition-colors duration-200 hover:bg-blue-600 no-underline">🎵</a>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-[1.2rem] transition-colors duration-200 hover:bg-blue-600 no-underline">💬</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
          <p className="mb-1">&copy; {currentYear} {config.businessName}. Semua hak dilindungi.</p>
          <p className="text-xs">Layanan Sewa Kasur Busa Terpercaya di Yogyakarta</p>
        </div>
      </div>
    </footer>
  );
}
