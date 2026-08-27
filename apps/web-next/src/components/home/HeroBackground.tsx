'use client';

import { useCallback, useEffect, useState } from 'react';

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
  const [isPaused, setIsPaused] = useState(false);
  const [canAutoRotate, setCanAutoRotate] = useState(false);
  const [announcement, setAnnouncement] = useState({ message: '', sequence: 0 });
  const isAutoPlaying = canAutoRotate && !isPaused;

  const goToSlide = useCallback((index: number) => {
    const nextSlide = (index + slides.length) % slides.length;
    setCurrentSlide(nextSlide);
    setAnnouncement((current) => ({
      message: `Gambar ${nextSlide + 1} dari ${slides.length}`,
      sequence: current.sequence + 1,
    }));
  }, []);

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
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

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
                alt={index === currentSlide ? slide.alt : ''}
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

      <div className="home-hero-switcher" aria-label="Pilihan gambar utama">
        <button
          type="button"
          className="home-hero-switcher-button"
          onClick={() => goToSlide(currentSlide - 1)}
          aria-label="Gambar sebelumnya"
        >
          <ChevronLeftIcon />
        </button>

        <div className="home-hero-switcher-dots" role="group" aria-label="Pilih gambar">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.src}
              className={`home-hero-switcher-dot${index === currentSlide ? ' is-active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Tampilkan gambar ${index + 1} dari ${slides.length}`}
              aria-current={index === currentSlide ? 'true' : undefined}
            />
          ))}
        </div>

        <span className="home-hero-switcher-count">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>

        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement.message ? (
            <span key={announcement.sequence} data-announcement-sequence={announcement.sequence}>
              {announcement.message}
            </span>
          ) : null}
        </span>

        <button
          type="button"
          className="home-hero-switcher-button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={canAutoRotate ? (isAutoPlaying ? 'Jeda slideshow' : 'Putar slideshow') : 'Putar otomatis dinonaktifkan'}
          title={canAutoRotate ? (isAutoPlaying ? 'Jeda slideshow' : 'Putar slideshow') : 'Putar otomatis dinonaktifkan'}
          disabled={!canAutoRotate}
        >
          {isAutoPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          type="button"
          className="home-hero-switcher-button"
          onClick={() => goToSlide(currentSlide + 1)}
          aria-label="Gambar berikutnya"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7v10M15 7v10" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 7 8 5-8 5Z" />
    </svg>
  );
}
