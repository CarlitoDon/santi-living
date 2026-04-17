'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/images/stok-kasur.png', alt: 'Stok Kasur Busa Santi Mebel Jogja' },
  { src: '/images/gudang.webp', alt: 'Gudang Santi Mebel Jogja' },
];

export default function AboutPage() {
  const currentSlide = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    const allSlides = trackRef.current?.querySelectorAll('.carousel-slide');
    const allDots = dotsRef.current?.querySelectorAll('.carousel-dot');
    allSlides?.forEach((s, i) => s.classList.toggle('active', i === index));
    allDots?.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide.current = index;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide.current + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [goToSlide]);

  return (
    <main className="about-page" style={{ paddingTop: '70px' }}>
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="section-title" style={{ textAlign: 'left' }}>Tentang Kami</h2>
              <p className="about-text">
                <strong>Santi Mebel Godean</strong> telah melayani kebutuhan furniture
                warga Jogja selama bertahun-tahun. Kini, kami menghadirkan{' '}
                <strong>Sewa Kasur Busa Jogja</strong> sebagai solusi praktis bagi Anda
                yang membutuhkan kasur busa tambahan berkualitas dengan harga terjangkau.
              </p>
              <p className="about-text">
                Kami memahami kebutuhan akan kasur busa yang bersih, nyaman, dan cepat
                sampai. Oleh karena itu, kami berkomitmen memberikan layanan{' '}
                <strong>same-day delivery</strong> untuk area Jogja agar tamu atau
                keluarga Anda tidak perlu menunggu lama.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Kasur Busa Ready</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Pelanggan Puas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">Same Day</span>
                  <span className="stat-label">Delivery Jogja</span>
                </div>
              </div>
            </div>

            <div className="about-carousel">
              <div className="carousel-track" ref={trackRef}>
                {slides.map((s, i) => (
                  <div key={i} className={`carousel-slide ${i === 0 ? 'active' : ''}`}>
                    <Image src={s.src} alt={s.alt} width={600} height={600} className="about-image" />
                  </div>
                ))}
              </div>
              <div className="carousel-dots" ref={dotsRef}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === 0 ? 'active' : ''}`}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
              <div className="image-caption">
                Stok kasur busa kami selalu ready dan terjaga kebersihannya.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Mengapa Memilih Kami?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Kasur Busa Bersih &amp; Steril</h3>
              <p>Setiap kasur busa dipastikan bersih dan melalui proses sanitasi sebelum dikirim.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Pengiriman Cepat</h3>
              <p>Pesan sebelum jam 15:00, kasur busa sampai di hari yang sama untuk area Jogja.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Harga Transparan</h3>
              <p>Tidak ada biaya tersembunyi. Harga sewa harian murah dengan durasi fleksibel.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page { padding-top: var(--space-4); }
        .about-grid { display: grid; gap: var(--space-8); }
        .about-text { font-size: var(--font-size-lg); line-height: 1.6; color: var(--color-text-secondary); margin-bottom: var(--space-4); }
        .about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-top: var(--space-8); background: var(--color-primary-light); padding: var(--space-6); border-radius: var(--radius-lg); text-align: center; }
        .stat-number { display: block; font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-primary); margin-bottom: var(--space-1); }
        .stat-label { font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        .about-carousel { position: relative; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); }
        .carousel-track { position: relative; width: 100%; aspect-ratio: 1/1; }
        .carousel-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; visibility: hidden; transition: opacity 0.6s ease, visibility 0.6s; }
        .carousel-slide.active { opacity: 1; visibility: visible; }
        .carousel-dots { position: absolute; bottom: var(--space-10); left: 50%; transform: translateX(-50%); display: flex; gap: var(--space-2); z-index: 10; }
        .carousel-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5); border: none; cursor: pointer; transition: background 0.3s; }
        .carousel-dot.active { background: white; }
        .image-caption { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: var(--space-3); font-size: var(--font-size-sm); text-align: center; z-index: 10; }
        .bg-light { background: var(--color-surface); }
        .features-grid { display: grid; gap: var(--space-6); margin-top: var(--space-8); }
        .feature-card { background: var(--color-surface-elevated, white); padding: var(--space-6); border-radius: var(--radius-lg); text-align: center; box-shadow: var(--shadow-sm); }
        .feature-icon { font-size: 3rem; margin-bottom: var(--space-4); }
        .feature-card h3 { margin-bottom: var(--space-2); color: var(--color-primary); }
        @media (min-width: 768px) {
          .about-grid { grid-template-columns: 1fr 1fr; align-items: center; }
          .features-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </main>
  );
}
