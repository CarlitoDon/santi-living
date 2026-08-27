'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHostCta } from '@/hooks/useHostCta';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import { useT } from '@/contexts/locale';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLocale } from '@/contexts/locale';
import { localeHref } from '@/utils/localeHref';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { usePresence } from '@/hooks/usePresence';
import { useMainSiteHref } from '@/hooks/useMainSiteHref';

type NavLink = {
  href: string;
  label: string;
  site?: 'main' | 'current';
  children?: Array<{ href: string; label: string }>;
};

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [restoreScrollOnUnlock, setRestoreScrollOnUnlock] = useState(true);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hashScrollTimerRef = useRef<number | null>(null);
  const hostCta = useHostCta();
  const t = useT();
  const { locale } = useLocale();
  const presence = usePresence(isOpen, 300);
  const getMainSiteHref = useMainSiteHref(locale);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Set initial hash
    if (typeof window !== 'undefined') {
      setActiveHash(window.location.hash);
    }

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Also listen to popstate to catch back/forward hash changes
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setRestoreScrollOnUnlock(false);
      setIsOpen(false);
      // Reset hash on actual page/pathname change if no hash present
      if (typeof window !== 'undefined') {
        setActiveHash(window.location.hash);
      }
    }, 0);
    return () => clearTimeout(closeTimer);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (hashScrollTimerRef.current !== null) {
        window.clearTimeout(hashScrollTimerRef.current);
      }
    };
  }, []);

  const scrollToHashAfterUnlock = (hash: string) => {
    if (hashScrollTimerRef.current !== null) {
      window.clearTimeout(hashScrollTimerRef.current);
    }

    let attempts = 0;
    const scrollWhenReady = () => {
      const target = document.querySelector<HTMLElement>(hash);
      const bodyIsLocked = document.body.style.position === 'fixed';

      if ((!target || bodyIsLocked) && attempts < 20) {
        attempts += 1;
        hashScrollTimerRef.current = window.setTimeout(scrollWhenReady, 50);
        return;
      }

      if (!target || bodyIsLocked) return;

      const headerOffset = 96;
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - headerOffset,
      );
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      hashScrollTimerRef.current = null;
    };

    hashScrollTimerRef.current = window.setTimeout(scrollWhenReady, 320);
  };

  useBodyScrollLock(presence.shouldRender, {
    restoreScroll: restoreScrollOnUnlock,
  });

  useDialogFocus({
    isOpen,
    onClose: () => setIsOpen(false),
    containerRef: drawerRef,
    initialFocusRef: closeButtonRef,
  });

  const contextNavLink: NavLink =
    hostCta.context === 'karpet' || hostCta.context === 'permadani'
      ? { href: '#calculator', label: t('nav.cek_opsi'), site: 'current' }
      : hostCta.context === 'acara'
        ? { href: 'https://acara.santiliving.com/sewa-perlengkapan-event', label: t('nav.paket_event'), site: 'current' }
        : { href: '/#calculator', label: t('nav.hitung_biaya'), site: 'current' };

  const navLinks: NavLink[] = [
    { href: '/', label: t('nav.beranda') },
    {
      href: '/produk',
      label: t('nav.produk'),
      children: [
        { href: '/produk', label: t('nav.semua_produk') },
        { href: '/sewa-kasur-terdekat', label: t('nav.kasur') },
        { href: 'https://karpet.santiliving.com/sewa-karpet-jogja', label: t('nav.karpet') },
        { href: 'https://permadani.santiliving.com/sewa-karpet-permadani-jogja', label: t('nav.permadani') },
        { href: 'https://acara.santiliving.com/sewa-perlengkapan-event', label: t('nav.perlengkapan_event') },
      ],
    },
    { href: '/harga-sewa-kasur', label: t('nav.harga_sewa') },
    contextNavLink,
    { href: '/artikel', label: t('nav.artikel_tips') },
    { href: '/about', label: t('nav.tentang_kami') },
    { href: '/#service-area', label: t('nav.area_layanan') },
  ];

  return (
    <>
      <button 
        className="bg-transparent border-none cursor-pointer w-11 h-11 flex items-center justify-center z-[1001] relative shrink-0 hover:bg-slate-100 rounded-lg motion-interactive"
        onClick={() => {
          setRestoreScrollOnUnlock(true);
          setIsOpen(true);
        }}
        aria-label={t('header.open_menu')}
        aria-expanded={isOpen}
        aria-controls="site-navigation-drawer"
      >
        <div className="w-6 h-[18px] flex flex-col justify-between">
          <span className={`block h-[3px] w-full bg-blue-600 rounded-[3px] transition-transform duration-300 ease-in-out origin-center ${isOpen ? 'translate-y-[7.5px] rotate-45' : ''}`}></span>
          <span className={`block h-[3px] w-full bg-blue-600 rounded-[3px] transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-[3px] w-full bg-blue-600 rounded-[3px] transition-transform duration-300 ease-in-out origin-center ${isOpen ? '-translate-y-[7.5px] -rotate-45' : ''}`}></span>
        </div>
      </button>

      {mounted && presence.shouldRender && createPortal(
        <>
          <div 
            className={`fixed inset-0 w-full h-full bg-slate-950/45 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ease-out z-[1000] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside
            ref={drawerRef}
            id="site-navigation-drawer"
            className={`nav-drawer fixed top-0 left-0 w-[300px] max-w-[88vw] h-[100dvh] bg-white shadow-[24px_0_60px_rgba(15,23,42,0.16)] transition-transform duration-300 ease-out z-[1002] p-6 flex flex-col overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            data-state={presence.state}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-navigation-title"
            aria-hidden={!isOpen}
            inert={!isOpen}
            tabIndex={-1}
          >
            <div className="flex justify-between items-center mb-7 pb-5 border-b border-slate-100">
              <span id="site-navigation-title" className="text-base font-bold text-slate-900">{t('header.menu')}</span>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <button 
                  ref={closeButtonRef}
                  className="bg-transparent border-none w-11 h-11 flex items-center justify-center text-2xl leading-none cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg motion-interactive"
                  onClick={() => setIsOpen(false)}
                  aria-label={t('header.close_menu')}
                >
                  &times;
                </button>
              </div>
            </div>

            <ul className="list-none p-0 m-0">
              {navLinks.map((link) => {
                const linkHref = localeHref(link.href, locale);
                const navigationHref = link.site === 'current'
                  ? linkHref
                  : getMainSiteHref(link.href);
                
                let isActive = false;
                const hasHash = link.href.includes('#');
                
                if (hasHash) {
                  const targetHash = link.href.substring(link.href.indexOf('#'));
                  isActive = activeHash === targetHash;
                } else if (link.href === '/' || link.href === '') {
                  const isHomePath = pathname === '/' || pathname === '/id' || pathname === '/en';
                  isActive = isHomePath && !activeHash;
                } else {
                  isActive = pathname === linkHref || (linkHref !== '/' + locale && pathname.startsWith(linkHref));
                }

                return (
                  <li key={link.href} className="nav-drawer-item mb-1">
                    <Link 
                      href={navigationHref}
                      className={`block px-3 py-2.5 rounded-lg text-[0.95rem] font-medium motion-interactive ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50 font-bold shadow-[inset_0_0_0_1px_#dbeafe]' 
                          : 'text-slate-800 no-underline hover:text-blue-600 hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        setRestoreScrollOnUnlock(false);
                        if (hasHash) {
                          const targetHash = link.href.substring(link.href.indexOf('#'));
                          setActiveHash(targetHash);
                          scrollToHashAfterUnlock(targetHash);
                        } else {
                          setActiveHash('');
                        }
                        setIsOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>

                    {link.children && (
                      <ul className="pl-4 mt-2">
                        {link.children.map((sub) => {
                          const subHref = getMainSiteHref(sub.href);
                          const isSubActive = pathname === subHref || (subHref !== '/' + locale && pathname.startsWith(subHref));
                          return (
                            <li key={sub.href} className="mb-1">
                              <Link
                                href={subHref}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${isSubActive ? 'text-blue-600 font-semibold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}
                                onClick={() => {
                                  setRestoreScrollOnUnlock(false);
                                  setIsOpen(false);
                                }}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li>
                <a
                  href={getWhatsAppUrl(hostCta.waText, 'nav_sidebar')}
                  className="mt-6 bg-blue-600 text-white text-center block w-full p-3.5 rounded-lg font-bold shadow-sm hover:bg-blue-700 hover:shadow-md motion-interactive motion-lift no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source="nav_sidebar"
                  data-wa-location="sidebar"
                >
                  {hostCta.navLabel}
                </a>
              </li>
            </ul>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}
