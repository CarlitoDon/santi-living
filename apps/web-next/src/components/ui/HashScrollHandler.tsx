'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (!hash) return;

      const id = decodeURIComponent(hash.replace('#', ''));
      const element = document.getElementById(id);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Hydration and layout shifts in Next.js might delay element rendering.
    // Try multiple intervals to ensure it handles dynamic load/settling.
    const timer1 = setTimeout(handleScroll, 100);
    const timer2 = setTimeout(handleScroll, 400);
    const timer3 = setTimeout(handleScroll, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  return null;
}
