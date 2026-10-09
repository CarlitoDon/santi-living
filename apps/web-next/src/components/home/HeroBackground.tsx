'use client';

import { useEffect, useState } from 'react';

const slides = [
  {
    src: '/images/hero-pengiriman-santi-living.webp',
    mobileSrc: '/images/hero-pengiriman-santi-living-mobile.webp',
    alt: 'Pengiriman kasur Santi Living di Yogyakarta',
    objectPosition: '68% center',
  },
  {
    src: '/images/hero-kamar-siap.webp',
    mobileSrc: '/images/hero-kamar-siap-mobile.webp',
    alt: 'Kasur sewa yang sudah rapi dan siap digunakan',
    objectPosition: 'center',
  },
  {
    src: '/images/hero-siap-antar.webp',
    mobileSrc: '/images/hero-siap-antar-mobile.webp',
    alt: 'Kasur dan perlengkapan bersih yang siap diantar',
    objectPosition: 'center',
  },
  {
    src: '/images/hero-stok-premium.webp',
    mobileSrc: '/images/hero-stok-premium-mobile.webp',
    alt: 'Stok kasur Santi Living yang bersih dan tertata',
    objectPosition: 'center',
  },
];

const SLIDE_DURATION = 8500;

export function HeroBackground() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canAutoRotate, setCanAutoRotate] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateAutoRotate = () => {
      setCanAutoRotate(!reducedMotion.matches && document.visibilityState === 'visible');
    };

    updateAutoRotate();
    reducedMotion.addEventListener('change', updateAutoRotate);
    document.addEventListener('visibilitychange', updateAutoRotate);

    return () => {
      reducedMotion.removeEventListener('change', updateAutoRotate);
      document.removeEventListener('visibilitychange', updateAutoRotate);
    };
  }, []);

  useEffect(() => {
    if (!canAutoRotate) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [canAutoRotate]);

  return (
    <>
      <div className="absolute inset-0 w-full h-full z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            aria-hidden={index !== currentSlide}
            className={`absolute inset-0 w-full h-full transition-[opacity,transform] duration-[1400ms] ease-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            } ${index === currentSlide ? 'scale-100' : 'scale-[1.025]'}`}
          >
            <picture className="absolute inset-0 block h-full w-full">
              <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
              {/* Precompressed responsive heroes avoid loading both crops. */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: slide.objectPosition }}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            </picture>
          </div>
        ))}
      </div>
      <div className="home-hero-overlay absolute inset-0 w-full h-full z-1" />
    </>
  );
}
