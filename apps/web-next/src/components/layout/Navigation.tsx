'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHostCta } from '@/hooks/useHostCta';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import { useT } from '@/contexts/locale';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLocale } from '@/contexts/locale';
import { localeHref } from '@/utils/localeHref';

type NavLink = {
  href: string;
  label: string;
  children?: Array<{ href: string; label: string }>;
};

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const hostCta = useHostCta();
  const t = useT();
  const { locale } = useLocale();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  }, [pathname]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const contextNavLink: NavLink =
    hostCta.context === 'karpet' || hostCta.context === 'permadani'
      ? { href: '#calculator', label: t('nav.cek_opsi') }
      : hostCta.context === 'acara'
        ? { href: 'https://acara.santiliving.com/sewa-perlengkapan-event', label: t('nav.paket_event') }
        : { href: '/#calculator', label: t('nav.hitung_biaya') };

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
      className="bg-transparent border-none cursor-pointer p-2 block z-[1001] relative shrink-0 hover:bg-slate-50 rounded-md transition-colors" 
      onClick={() => setIsOpen(true)}
      aria-label={t('header.open_menu')}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-[18px] flex flex-col justify-between">
          <span className={`block h-[3px] w-full bg-blue-600 rounded-[3px] transition-transform duration-300 ease-in-out origin-center ${isOpen ? 'translate-y-[7.5px] rotate-45' : ''}`}></span>
          <span className={`block h-[3px] w-full bg-blue-600 rounded-[3px] transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-[3px] w-full bg-blue-600 rounded-[3px] transition-transform duration-300 ease-in-out origin-center ${isOpen ? '-translate-y-[7.5px] -rotate-45' : ''}`}></span>
        </div>
      </button>

      {mounted && createPortal(
        <>
          <div 
            className={`fixed inset-0 w-full h-full bg-black/50 transition-all duration-300 ease-in-out z-[1000] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside className={`fixed top-0 w-[280px] h-screen bg-white shadow-[2px_0_10px_rgba(0,0,0,0.2)] transition-[left] duration-300 ease-in-out z-[1002] p-6 flex flex-col overflow-y-auto ${isOpen ? 'left-0' : '-left-[300px]'}`}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-blue-600">{t('header.menu')}</span>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <button 
                className="bg-transparent border-none text-3xl leading-none cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-none" 
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
                const isActive = pathname === linkHref || (linkHref !== '/' + locale && pathname.startsWith(linkHref));
                return (
                  <li key={link.href} className="mb-2">
                    <Link 
                      href={typeof link.href === 'string' ? localeHref(link.href, locale) : link.href} 
                      className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ease-in-out ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50 font-bold shadow-[inset_0_0_0_1px_#dbeafe]' 
                          : 'text-slate-800 no-underline hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>

                    {link.children && (
                      <ul className="pl-4 mt-2">
                        {link.children.map((sub) => {
                          const subHref = localeHref(sub.href, locale);
                          const isSubActive = pathname === subHref || (subHref !== '/' + locale && pathname.startsWith(subHref));
                          return (
                            <li key={sub.href} className="mb-1">
                              <Link
                                href={subHref}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${isSubActive ? 'text-blue-600 font-semibold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}
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
                  className="mt-6 bg-blue-600 text-white text-center block w-full p-4 rounded-xl font-bold shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] transition-all no-underline"
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
