'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from './Navigation';
import { useHostCta } from '@/hooks/useHostCta';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import { useLocale } from '@/contexts/locale';
import { localeHref } from '@/utils/localeHref';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const hostCta = useHostCta();
  const { locale } = useLocale();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const headerHeight = header.offsetHeight;
    let lastScrollY = Math.max(0, window.scrollY);
    let headerOffset = 0;
    let animationFrame: number | null = null;

    function updateHeader() {
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
      animationFrame = null;
    }

    function onScroll() {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateHeader);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-slate-200/80 py-2 will-change-transform shadow-[0_8px_25px_-22px_rgba(47,33,25,0.45)] transition-transform duration-300 ease-out">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-[54px] md:h-[58px]">
          
          {/* Left: Navigation Menu */}
          <div className="flex-1 flex justify-start">
            <Navigation />
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="m-0 leading-none">
              <Link href={localeHref("/", locale)} className="no-underline text-inherit flex flex-row items-end gap-1.5 md:gap-2 group motion-interactive">
                <span className="block font-serif text-[22px] md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">Santi Living</span>
                <span className="flex flex-row items-baseline gap-1 md:gap-1.5 pb-[1px] md:pb-[3px]">
                  <span className="text-[10px] md:text-[11px] font-medium italic text-slate-400">by</span>
                  <Image
                    src="/images/logo-santi-mebel.png"
                    alt="Santi Mebel Jogja"
                    width={65}
                    height={22}
                    className="opacity-90 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      width: 'clamp(50px, 4.5vw, 65px)',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                    sizes="(max-width: 768px) 50px, 65px"
                    priority
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Language Toggle + CTA WhatsApp */}
          <div className="flex-1 flex justify-end items-center gap-1">
            {/* desktop toggle */}
            <div className="hidden sm:flex items-center">
              <LanguageToggle />
            </div>
            <a
              href={getWhatsAppUrl(hostCta.waText, 'header_desktop')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex min-h-11 items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:shadow-md motion-interactive motion-lift"
              data-wa-source="header_desktop"
              data-wa-location="header"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path></svg>
              <span>{hostCta.desktopLabel}</span>
            </a>
            <a
              href={getWhatsAppUrl(hostCta.waText, 'header_mobile')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex sm:hidden items-center justify-center bg-emerald-500 active:bg-emerald-600 text-white w-10 h-10 rounded-lg shadow-sm motion-interactive"
              aria-label={hostCta.mobileAriaLabel}
              data-wa-source="header_mobile"
              data-wa-location="header"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
