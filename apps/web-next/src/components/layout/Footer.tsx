'use client';

import Link from 'next/link';
import Image from 'next/image';
import { config } from '@/data/config';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid gap-8 mb-8 md:grid-cols-[2fr_1fr_1fr]">
          {/* NAP Section for Local SEO */}
          <div>
            <Link href="/" className="inline-flex flex-row items-end gap-1.5 md:gap-2 group mb-6 no-underline text-inherit">
              <span className="block font-serif text-2xl font-extrabold text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">Santi Living</span>
              <span className="flex flex-row items-baseline gap-1 md:gap-1.5 pb-[1px] md:pb-[3px]">
                <span className="text-[10px] font-medium italic text-slate-400">by</span>
                <div className="relative h-[18px] w-[55px] opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <Image
                    src="/images/logo-santi-mebel.png"
                    alt="Santi Mebel Jogja"
                    className="object-contain"
                    fill
                    sizes="55px"
                  />
                </div>
              </span>
            </Link>
            <address className="not-italic text-slate-400 leading-[1.8]">
              <p className="mb-2 flex items-start gap-2">
                <span className="shrink-0">📍</span>
                <span>
                  Jl. Godean KM 10 Geneng, RT.05/RW.04,<br />
                  Sidoagung, Kec. Godean, Kabupaten Sleman,<br />
                  DI Yogyakarta 55264
                </span>
              </p>
              <p className="mb-2">
                <a 
                  href="https://maps.google.com/maps?cid=5972418444444444444" 
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
              <a href="https://www.instagram.com/santi.mebel/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-white transition-colors duration-200 hover:bg-blue-600 no-underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.tiktok.com/@santi_mebel" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-white transition-colors duration-200 hover:bg-blue-600 no-underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-white transition-colors duration-200 hover:bg-green-600 no-underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
              </a>
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
