'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from './Navigation';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const headerHeight = header.offsetHeight;
    let lastScrollY = Math.max(0, window.scrollY);
    let headerOffset = 0;

    function onScroll() {
      const currentScrollY = Math.max(0, window.scrollY);
      if (currentScrollY <= 0) {
        headerOffset = 0;
      } else {
        const diff = currentScrollY - lastScrollY;
        headerOffset = Math.min(Math.max(headerOffset + diff, 0), headerHeight);
      }
      if (header) {
        header.style.transform = `translateY(-${headerOffset}px)`;
      }
      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-white/20 py-3 will-change-transform shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-[transform,background-color] duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-[54px] md:h-[60px]">
          
          {/* Left: Navigation Menu */}
          <div className="flex-1 flex justify-start">
            <Navigation />
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <h1 className="m-0 leading-none">
              <Link href="/" className="no-underline text-inherit flex flex-row items-end gap-1.5 md:gap-2 group">
                <span className="block font-serif text-[22px] md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">Santi Living</span>
                <span className="flex flex-row items-baseline gap-1 md:gap-1.5 pb-[1px] md:pb-[3px]">
                  <span className="text-[10px] md:text-[11px] font-medium italic text-slate-400">by</span>
                  <div className="relative h-[16px] w-[50px] md:h-[22px] md:w-[65px] opacity-90 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image
                      src="/images/logo-santi-mebel.png"
                      alt="Santi Mebel Jogja"
                      className="object-contain"
                      fill
                      sizes="(max-width: 768px) 50px, 65px"
                      priority
                    />
                  </div>
                </span>
              </Link>
            </h1>
          </div>

          {/* Right: CTA WhatsApp */}
          <div className="flex-1 flex justify-end">
            <a
              href={getWhatsAppUrl('Halo Santi Living, saya mau pesan sewa kasur.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)] hover:-translate-y-[1px] transition-all"
            >
              <svg xmlns="http://www.w3.org/-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path></svg>
              <span>Pesan</span>
            </a>
            <a
              href={getWhatsAppUrl('Halo Santi Living, saya mau pesan sewa kasur.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex sm:hidden items-center justify-center bg-gradient-to-r from-green-500 to-green-600 active:from-green-600 active:to-green-700 text-white w-9 h-9 rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)] transition-all"
              aria-label="Pesan via WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
