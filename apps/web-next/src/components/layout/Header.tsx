'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <header ref={headerRef} className="site-header">
      <div className="container">
        <div className="header-content">
          <div className="header-logo-group">
            <h1 className="site-title">
              <Link href="/" className="logo-link">
                <span className="site-name">Santi Living</span>
                <span className="brand-line">
                  <span className="by">by</span>
                  <Image
                    src="/images/logo-santi-mebel.png"
                    alt="Santi Mebel Jogja"
                    className="brand-logo"
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

      <style jsx>{`
        .site-header {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-4) 0;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          will-change: transform;
        }
        .header-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: var(--space-2);
          min-height: 50px;
        }
        .logo-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .site-title {
          margin: 0;
          line-height: 1.2;
        }
        .site-name {
          display: block;
          font-family: var(--font-noto-serif), 'Noto Serif', serif;
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          letter-spacing: -0.5px;
        }
        .brand-line {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        .by {
          font-size: 10px;
          font-weight: var(--font-weight-normal);
          font-style: italic;
          color: var(--color-text-muted);
        }
        .brand-logo {
          height: 28px;
          width: auto;
          border-radius: var(--radius-sm);
        }
        @media (min-width: 768px) {
          .logo-link {
            flex-direction: row;
            align-items: center;
            gap: var(--space-3);
          }
        }
      `}</style>
    </header>
  );
}
