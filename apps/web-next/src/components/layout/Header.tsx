'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from './Navigation';

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
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-slate-200 py-3 will-change-transform shadow-sm">
      <div className="container mx-auto px-4">
        <div className="relative flex justify-center items-center h-[54px]">
          <Navigation />
          <div className="flex flex-col items-center justify-center">
            <h1 className="m-0 leading-tight">
              <Link href="/" className="no-underline text-inherit flex flex-col md:flex-row items-center md:gap-3">
                <span className="block font-serif text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Santi Living</span>
                <span className="flex items-center gap-1">
                  <span className="text-[10px] font-normal italic text-slate-500">by</span>
                  <Image
                    src="/images/logo-santi-mebel.png"
                    alt="Santi Mebel Jogja"
                    className="h-[24px] md:h-[28px] w-auto rounded-sm"
                    width={80}
                    height={28}
                    priority
                  />
                </span>
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
