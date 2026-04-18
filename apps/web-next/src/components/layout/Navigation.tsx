'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

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

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/produk', label: 'Produk' },
    { href: '/harga-sewa-kasur', label: 'Harga Sewa' },
    { href: '/#calculator', label: 'Hitung Biaya' },
    { href: '/artikel', label: 'Artikel & Tips' },
    { href: '/about', label: 'Tentang Kami' },
    { href: '/#service-area', label: 'Area Layanan' },
  ];

  return (
    <>
      <button 
        className="bg-transparent border-none cursor-pointer p-2 block z-[1001] relative shrink-0 hover:bg-slate-50 rounded-md transition-colors" 
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
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
              <span className="text-xl font-bold text-blue-600">Menu</span>
              <button 
                className="bg-transparent border-none text-3xl leading-none cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-none" 
                onClick={() => setIsOpen(false)}
                aria-label="Close Menu"
              >
                &times;
              </button>
            </div>

            <ul className="list-none p-0 m-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <li key={link.href} className="mb-2">
                    <Link 
                      href={link.href} 
                      className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ease-in-out ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50 font-bold shadow-[inset_0_0_0_1px_#dbeafe]' 
                          : 'text-slate-800 no-underline hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href={getWhatsAppUrl('Halo Santi Living, saya mau bertanya seputar layanan sewa kasur.')}
                  className="mt-6 bg-blue-600 text-white text-center block w-full p-4 rounded-xl font-bold shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] transition-all no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi WhatsApp
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
