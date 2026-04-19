'use client';

import type { LandingPageConfig, ThemeColor } from '@/types/landing';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import Link from 'next/link';

interface LandingPageProps {
  config: LandingPageConfig;
}

const GRADIENT_MAP: Record<ThemeColor, string> = {
  blue: 'bg-gradient-to-br from-blue-600 to-[#1e3a8a]',
  purple: 'bg-gradient-to-br from-purple-600 to-[#6d28d9]',
  green: 'bg-gradient-to-br from-emerald-600 to-[#047857]',
  cyan: 'bg-gradient-to-br from-cyan-600 to-[#0e7490]',
  emerald: 'bg-gradient-to-br from-emerald-500 to-[#065f46]',
  indigo: 'bg-gradient-to-br from-indigo-600 to-[#3730a3]',
};

const TEXT_MAP: Record<ThemeColor, string> = {
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  green: 'text-emerald-600',
  cyan: 'text-cyan-600',
  emerald: 'text-emerald-600',
  indigo: 'text-indigo-600',
};

const BORDER_MAP: Record<ThemeColor, string> = {
  blue: 'border-blue-600',
  purple: 'border-purple-600',
  green: 'border-emerald-600',
  cyan: 'border-cyan-600',
  emerald: 'border-emerald-600',
  indigo: 'border-indigo-600',
};

const BG_MAP: Record<ThemeColor, string> = {
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  green: 'bg-emerald-600',
  cyan: 'bg-cyan-600',
  emerald: 'bg-emerald-600',
  indigo: 'bg-indigo-600',
};

export function LandingPage({ config: cfg }: LandingPageProps) {
  const gradientClass = GRADIENT_MAP[cfg.color] || GRADIENT_MAP.blue;
  const textClass = TEXT_MAP[cfg.color] || TEXT_MAP.blue;
  const borderClass = BORDER_MAP[cfg.color] || BORDER_MAP.blue;
  const bgClass = BG_MAP[cfg.color] || BG_MAP.blue;

  return (
    <main className="pt-[80px]">
      {/* Hero */}
      <section className={`${gradientClass} py-12 md:py-16 pb-14 text-center text-white relative overflow-hidden`}>
        <div className="absolute top-[10%] left-[5%] w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white drop-shadow-md">
            {cfg.hero.title}
          </h1>
          <p className="text-lg text-white/90 m-0 max-w-2xl mx-auto drop-shadow-sm font-medium mb-4">
            {cfg.hero.subtitle}
          </p>
          {cfg.hero.badge && (
            <div className="mx-auto inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white border border-white/20 backdrop-blur-sm shadow-sm">
              {cfg.hero.badge}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      {cfg.benefits && cfg.benefits.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">
              {`Kenapa Pilih ${cfg.hero.title.replace('Jogja', '').trim()}?`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {cfg.benefits.map((b, i) => (
                <FeatureCard key={i} icon={b.icon} title={b.title} description={b.description} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Cards */}
      {cfg.priceCards && cfg.priceCards.length > 0 && (
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">Harga Sewa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {cfg.priceCards.map((card, i) => (
                <div 
                  key={i} 
                  className={`bg-white rounded-xl p-6 text-center shadow-sm relative border ${card.popular ? `border-2 ${borderClass} shadow-md scale-105 z-10` : 'border-slate-200'}`}
                >
                  {card.popular && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full ${bgClass}`}>
                      Best Value
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{card.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">{card.size}</div>
                  <div className={`text-3xl font-extrabold ${textClass} mb-1 flex items-baseline justify-center gap-1`}>
                    {card.price} <span className="text-sm font-normal text-slate-500">/bulan</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">{card.daily}</div>
                  <div className="text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100">{card.note}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 text-sm">
              <Link href="/harga-sewa-kasur" className={`font-semibold ${textClass} hover:opacity-80`}>
                Lihat daftar harga lengkap semua ukuran →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Audience */}
      {cfg.audience && cfg.audience.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">Siapa yang Biasanya Menyewa?</h2>
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
              {cfg.audience.map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">{item.title}</h3>
                    <p className="text-sm text-slate-500 m-0">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extra HTML sections */}
      {cfg.sections?.map((section, i) => (
        <section key={i} className={`py-12 md:py-16 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">{section.title}</h2>
            <div className="prose prose-slate max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <FAQAccordion items={cfg.faqs} title="Pertanyaan Umum" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${gradientClass} py-12 md:py-16 text-center text-white`}>
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">{cfg.cta.title}</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">{cfg.cta.description}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link 
              href="/#calculator" 
              className="bg-white text-slate-900 w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold hover:bg-slate-50 transition-colors text-center inline-flex justify-center items-center h-14"
            >
              Hitung Biaya Sewa
            </Link>
            <a
              href={getWhatsAppUrl(cfg.cta.waText)}
              className="bg-transparent border-2 border-white/50 text-white w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold hover:bg-white/10 hover:border-white transition-colors text-center inline-flex justify-center items-center h-14"
              target="_blank"
              rel="noopener"
              data-wa-source={cfg.cta.waSource}
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
