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
            aria-hidden={index !== currentSlide}
            className={`absolute inset-0 w-full h-full transition-[opacity,transform] duration-[1400ms] ease-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            } ${index === currentSlide ? 'scale-100' : 'scale-[1.025]'}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              loading="eager"
              unoptimized={index === 0}
              quality={75}
              className="object-cover"
              sizes={index === 0 ? '(max-width: 768px) 100vw, 700px' : '100vw'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>
      <div 
        className="absolute inset-0 w-full h-full z-1" 
        style={{
          background: 'linear-gradient(90deg, rgba(38, 26, 20, 0.96) 0%, rgba(58, 41, 31, 0.88) 54%, rgba(71, 50, 39, 0.66) 100%)'
        }}
      />
    </>
  );
}
