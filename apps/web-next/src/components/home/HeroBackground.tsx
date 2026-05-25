'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/images/stok-kasur.webp', alt: 'Stok kasur sewa Jogja' },
  { src: '/images/gudang.webp', alt: 'Gudang kasur Santi Living' },
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
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              unoptimized={index === 0}
              quality={index === 0 ? 75 : 60}
              className="object-cover"
              sizes={index === 0 ? '(max-width: 768px) 100vw, 700px' : '100vw'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>
      {/* Gradient Overlay mirroring Astro */}
      <div 
        className="absolute inset-0 w-full h-full z-1" 
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(30, 64, 175, 0.9) 100%)'
        }}
      />
    </>
  );
}
