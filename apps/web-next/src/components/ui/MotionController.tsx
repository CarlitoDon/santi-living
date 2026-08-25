'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL_SELECTOR = '[data-reveal]';

function isInitiallyVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > window.innerHeight * 0.06 && rect.top < window.innerHeight * 0.92;
}

/**
 * Small, dependency-free motion layer for server-rendered content.
 * Elements remain visible without JavaScript and only transition after hydration.
 */
export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>('main > section, main > article, main > div > section')
      .forEach((element) => {
        if (!element.hasAttribute('data-reveal') && !element.querySelector(REVEAL_SELECTOR)) {
          element.dataset.reveal = 'up';
          element.dataset.revealAuto = 'true';
        }
      });

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );

    if (elements.length === 0) return;

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const initiallyVisible: HTMLElement[] = [];

    elements.forEach((element) => {
      const delay = element.dataset.revealDelay;
      if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`);

      if (prefersReducedMotion) {
        element.dataset.revealState = 'visible';
      } else {
        element.dataset.revealState = 'hidden';
        if (isInitiallyVisible(element)) initiallyVisible.push(element);
      }
    });

    root.dataset.motionReady = 'true';

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.dataset.revealState = 'visible';
      });
      return;
    }

    const entryFrame = window.requestAnimationFrame(() => {
      initiallyVisible.forEach((element) => {
        element.dataset.revealState = 'visible';
        element.dataset.revealEntered = 'true';
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const hasEntered = element.dataset.revealEntered === 'true';

          if (entry.isIntersecting) {
            element.dataset.revealState = 'visible';
            element.dataset.revealEntered = 'true';
          } else if (element.dataset.revealOnce !== 'true' || !hasEntered) {
            element.dataset.revealState = 'hidden';
          }
        });
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      window.cancelAnimationFrame(entryFrame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
