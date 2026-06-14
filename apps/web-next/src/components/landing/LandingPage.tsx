'use client';

import type { ReactNode } from 'react';
import type { LandingPageConfig, ThemeColor } from '@/types/landing';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import { useLocale, useT } from '@/contexts/locale';
import Image from 'next/image';
import Link from 'next/link';

interface LandingPageProps {
  config: LandingPageConfig;
  children?: ReactNode;
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

function le<T>(val: T, enVal: T | undefined, locale: string): T {
  return locale === 'en' && enVal !== undefined ? enVal : val;
}

export function LandingPage({ config: cfg, children }: LandingPageProps) {
  const { locale } = useLocale();
  const t = useT();
  const en = locale === 'en' ? cfg.en : undefined;
  const gradientClass = GRADIENT_MAP[cfg.color] || GRADIENT_MAP.blue;
  const textClass = TEXT_MAP[cfg.color] || TEXT_MAP.blue;
  const borderClass = BORDER_MAP[cfg.color] || BORDER_MAP.blue;
  const bgClass = BG_MAP[cfg.color] || BG_MAP.blue;
  const isKarpetPage = cfg.tracking?.productCategory === 'karpet';
  const isEventPage = cfg.tracking?.productCategory === 'event';

  const defaultPriceGuideLabel = isKarpetPage
    ? t('landing.read_karpet_guide')
    : isEventPage
      ? t('landing.check_event_options')
      : t('landing.see_full_prices');
  const defaultPriceSectionTitle = isKarpetPage
    ? t('landing.karpet_options')
    : isEventPage
      ? t('landing.event_estimate')
      : t('landing.prices');
  const priceGuideHref = cfg.priceSection?.linkHref || (isKarpetPage
    ? 'https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026'
    : isEventPage
      ? (cfg.cta.secondaryHref || 'https://karpet.santiliving.com/sewa-karpet-jogja')
      : '/harga-sewa-kasur');
  const priceGuideLabel = le(cfg.priceSection?.linkLabel, en?.priceSection?.linkLabel, locale) || defaultPriceGuideLabel;
  const priceSectionTitle = le(cfg.priceSection?.title, en?.priceSection?.title, locale) || defaultPriceSectionTitle;

  const hero = en?.hero;
  const actions = le(cfg.hero.actions, en?.hero?.actions, locale);
  const benefits = le(cfg.benefits, en?.benefits, locale);
  const audience = le(cfg.audience, en?.audience, locale);
  const priceCards = le(cfg.priceCards, en?.priceCards, locale);
  const sections = en?.sections || cfg.sections;
  const faqs = en?.faqs || cfg.faqs;
  const badge = le(cfg.hero.badge, hero?.badge, locale);

  return (
    <main className="pt-[80px]">
      {/* Hero */}
      <section
        className={`${gradientClass} py-12 md:py-16 pb-14 text-center text-white relative overflow-hidden`}
      >
        {cfg.hero.bgImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={cfg.hero.bgImage}
              alt={le(cfg.hero.bgImageAlt || `${cfg.hero.title} - visual layanan Santi Living`, hero?.bgImageAlt || `${le(cfg.hero.title, hero?.title, locale)} - Santi Living visual`, locale)}
              fill
              priority
              sizes="100vw"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))' }} />
          </div>
        )}
        <div className="absolute top-[10%] left-[5%] w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10 text-center">
          {(en?.hero?.badges || cfg.hero.badges) && (en?.hero?.badges || cfg.hero.badges)!.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-3">
              {(en?.hero?.badges || cfg.hero.badges)!.map((b, bi) => (
                <div key={bi} className="inline-block bg-white/10 text-white text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wide">
                  {b}
                </div>
              ))}
            </div>
          )}

          {(en?.hero?.features || cfg.hero.features) && (en?.hero?.features || cfg.hero.features)!.length > 0 && (
            <div className="flex items-center justify-center gap-3 mb-3">
              {(en?.hero?.features || cfg.hero.features)!.map((f, fi) => (
                <div key={fi} className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-3 py-1 rounded-full font-medium shadow-sm">
                  {f.icon && <span className="text-base">{f.icon}</span>}
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white drop-shadow-md text-center">
            {le(cfg.hero.title, hero?.title, locale)}
          </h1>
          <p className="text-lg text-white/90 m-0 max-w-2xl mx-auto drop-shadow-sm font-medium mb-4 text-center">
            {le(cfg.hero.subtitle, hero?.subtitle, locale)}
          </p>
          {badge && (
            <div className="mx-auto inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white border border-white/20 backdrop-blur-sm shadow-sm">
              {badge}
            </div>
          )}
          {(actions && actions.length > 0) ? (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              {actions.map((a, i) => {
                if (a.type === 'link') {
                  return (
                    <Link
                      href={a.href || '/#calculator'}
                      key={i}
                      className="btn btn-lg bg-white text-slate-900 w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold hover:bg-slate-50 transition-colors text-center inline-flex justify-center items-center h-14 shadow"
                    >
                      {a.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={i}
                    href={getWhatsAppUrl(a.waText || cfg.cta.waText, a.waSource || cfg.cta.waSource)}
                    className="btn btn-lg btn-whatsapp shadow-md border-0 text-white w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold hover:bg-emerald-600 transition-colors text-center inline-flex justify-center items-center h-14"
                    target="_blank"
                    rel="noopener"
                    data-wa-source={a.waSource || cfg.cta.waSource}
                    data-wa-location="hero"
                    data-product-category={cfg.tracking?.productCategory}
                    data-page-type={cfg.tracking?.pageType}
                    data-wa-intent={cfg.tracking?.intent}
                  >
                    {a.label}
                  </a>
                );
              })}
            </div>
          ) : null}

          {(en?.hero?.phone || cfg.hero.phone) && (
            <div className="mt-3 text-white/80 text-sm">
              {t('landing.call_directly')} <span className="font-semibold">{le(cfg.hero.phone, hero?.phone, locale)}</span>
            </div>
          )}
        </div>
      </section>

      {children}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">
              {t('landing.why_choose_prefix')} {le(cfg.hero.title, hero?.title, locale).replace(/Jogja|Yogyakarta/g, '').trim()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {benefits.map((b, i) => (
                <FeatureCard key={i} icon={b.icon ?? ''} title={b.title ?? ''} description={b.description ?? ''} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Cards */}
      {priceCards && priceCards.length > 0 && (
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">
              {priceSectionTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {priceCards.map((card, i) => (
                <div 
                  key={i} 
                  className={`bg-white rounded-xl p-6 text-center shadow-sm relative border ${card.popular ? `border-2 ${borderClass} shadow-md scale-105 z-10` : 'border-slate-200'}`}
                >
                  {card.popular && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full ${bgClass}`}>
                      {t('landing.best_value')}
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{card.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">{card.size}</div>
                  <div className={`text-3xl font-extrabold ${textClass} mb-1 flex items-baseline justify-center gap-1`}>
                    {card.price}
                  </div>
                  <div className="text-xs text-slate-500 mb-3">{card.daily}</div>
                  <div className="text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100">{card.note}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 text-sm">
              <Link href={priceGuideHref} className={`font-semibold ${textClass} hover:opacity-80`}>
                {priceGuideLabel}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Audience */}
      {audience && audience.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">{t('landing.who_rents')}</h2>
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
              {audience.map((item, i) => (
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
      {sections?.map((section, i) => (
        <section key={i} className={`py-12 md:py-16 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
          <div className="container">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-8 text-slate-900">{section.title}</h2>
            <div className="prose prose-slate max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: section.content! }} />
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <FAQAccordion items={faqs} title={t('landing.faq_title')} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${gradientClass} py-12 md:py-16 text-center text-white`}>
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-white text-center">{le(cfg.cta.title, en?.cta?.title, locale)}</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed text-center">{le(cfg.cta.description, en?.cta?.description, locale)}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link 
              href={cfg.cta.secondaryHref || '/#calculator'} 
              className="bg-white text-slate-900 w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold hover:bg-slate-50 transition-colors text-center inline-flex justify-center items-center h-14"
            >
              {le(cfg.cta.secondaryLabel, en?.cta?.secondaryLabel, locale) || t('landing.calculate_cost')}
            </Link>
            <a
              href={getWhatsAppUrl(cfg.cta.waText, cfg.cta.waSource)}
              className="bg-transparent border-2 border-white/50 text-white w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold hover:bg-white/10 hover:border-white transition-colors text-center inline-flex justify-center items-center h-14"
              target="_blank"
              rel="noopener"
              data-wa-source={cfg.cta.waSource}
              data-wa-location="landing"
              data-product-category={cfg.tracking?.productCategory}
              data-page-type={cfg.tracking?.pageType}
              data-wa-intent={cfg.tracking?.intent}
            >
              {t('landing.chat_wa')}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
