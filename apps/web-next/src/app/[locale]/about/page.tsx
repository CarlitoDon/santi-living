'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/contexts/locale';

const slides = [
  { src: '/images/stok-kasur.png', alt: 'Stok Kasur Busa Santi Mebel Jogja' },
  { src: '/images/gudang.webp', alt: 'Gudang Santi Mebel Jogja' },
];

export default function AboutPage() {
  const t = useT();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pt-[110px]">
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left text-slate-900">{t('about.title')}</h2>
              <p className="text-lg leading-[1.6] text-slate-600 mb-4">{t('about.desc_1')}</p>
              <p className="text-lg leading-[1.6] text-slate-600 mb-4">{t('about.desc_2')}</p>
              <div className="grid grid-cols-3 gap-4 mt-8 bg-blue-50 p-6 rounded-lg text-center">
                <div>
                  <span className="block text-2xl font-bold text-blue-600 mb-1">100+</span>
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[1px]">{t('about.stat_mattress_ready')}</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600 mb-1">1000+</span>
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[1px]">{t('about.stat_happy_customers')}</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600 mb-1">Same Day</span>
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[1px]">{t('about.stat_delivery_jogja')}</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <div className="relative w-full aspect-square">
                {slides.map((s, i) => (
                  <div 
                    key={i} 
                    className={`absolute top-0 left-0 w-full h-full transition-all duration-[600ms] ease-in-out ${
                      currentSlide === i ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    <Image src={s.src} alt={s.alt} width={600} height={600} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`w-[10px] h-[10px] rounded-full border-none cursor-pointer transition-colors duration-300 ${
                      currentSlide === i ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 text-sm text-center z-10">
                {t('about.stock_ready')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-slate-900">{t('about.why_choose_us')}</h2>
          <div className="grid gap-6 mt-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-[3rem] mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{t('about.clean_steril_title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t('about.clean_steril_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-[3rem] mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{t('about.fast_delivery_title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t('about.fast_delivery_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-[3rem] mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{t('about.transparent_price_title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t('about.transparent_price_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
