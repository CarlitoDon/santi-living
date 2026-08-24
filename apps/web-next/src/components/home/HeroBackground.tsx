'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    src: '/images/hero-pengiriman-santi-living.webp',
    mobileSrc: '/images/hero-pengiriman-santi-living-mobile.webp',
    alt: 'Pengiriman kasur Santi Living di Yogyakarta',
    objectPosition: '68% center',
  },
  {
    src: '/images/stok-kasur.webp',
    mobileSrc: null,
    alt: 'Stok kasur sewa Jogja',
    objectPosition: 'center',
  },
  {
    src: '/images/gudang.webp',
    mobileSrc: null,
    alt: 'Gudang kasur Santi Living',
    objectPosition: 'center',
  },
];

export function HeroBackground() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
            {slide.mobileSrc ? (
              <picture className="absolute inset-0 block h-full w-full">
                <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                {/* Precompressed responsive hero; picture avoids loading both crops. */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: slide.objectPosition }}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            ) : (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                loading="lazy"
                quality={78}
                className="object-cover"
                style={{ objectPosition: slide.objectPosition }}
                sizes="100vw"
                fetchPriority="auto"
              />
            )}
          </div>
        ))}
      </div>
      <div className="home-hero-overlay absolute inset-0 w-full h-full z-1" />
    </>
  );
}
