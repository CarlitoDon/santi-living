import { config } from '@/data/config';
import { ProductPicker } from '@/components/home/ProductPicker';
import { CartBar } from '@/components/home/CartBar';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroBackground } from '@/components/home/HeroBackground';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { generateFAQSchema } from '@/utils/seo';
import { getWhatsAppUrl, WA_PRESET_ORDER } from '@/utils/whatsapp';
import { getDictionary } from '@/locales/dictionary';
import type { Locale } from '@/locales/dictionary';
import { AutoLocationTrigger } from '@/components/home/AutoLocationTrigger';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.seo?.home_title ?? 'Sewa Kasur Jogja Terbaik - Antar Jemput Same Day | Santi Living',
    description:
      dict.seo?.home_desc ??
      'Sewa kasur bersih di Jogja mulai Rp25.000/hari. ✅ Antar jemput same day ✅ Gratis ongkir area tertentu ✅ Kasur premium & steril ✅ Order via WhatsApp. Santi Living Yogyakarta.',
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const faqItems = dict.faq.items.map((item: { q: string; a: string }) => ({
    q: item.q,
    a: item.a,
  }));

  const steps = dict.steps.items.map((item: { icon: string; title: string; desc: string }) => ({
    icon: item.icon,
    title: item.title,
    desc: item.desc,
  }));

  const benefits = dict.benefits.items.map((item: { icon: string; title: string; desc: string }) => ({
    icon: item.icon,
    title: item.title,
    desc: item.desc,
  }));

  const serviceAreas = dict.location.service_areas as string[];

  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    name: 'Santi Living',
    description: dict.seo?.home_desc ?? '',
    url: 'https://santiliving.com',
    telephone: `+${config.whatsappNumber}`,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Jl. Godean KM10, Geneng, Sidoagung, Godean',
      addressLocality: 'Sleman',
      addressRegion: 'DI Yogyakarta',
      postalCode: '55264',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: config.storeLocation.lat,
      longitude: config.storeLocation.lng,
    },
    areaServed: serviceAreas.map((a: string) => ({ '@type': 'City' as const, name: a })),
  };

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <main className="pt-[80px]">
      <AutoLocationTrigger />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      {/* ===== HERO + CALCULATOR unified block ===== */}
      <div className="relative bg-gradient-to-br from-[#3b82f6]/90 to-[#1e40af]/95">

        {/* Hero text content */}
        <section className="relative pt-5 pb-16 md:pt-8 md:pb-20 text-center text-white flex items-center z-[2] overflow-hidden">
          <HeroBackground />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none z-[1]" />
          <div className="relative z-[10] max-w-3xl mx-auto px-4 w-full">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-1 rounded-full text-xs tracking-wider uppercase mb-3 text-white/90">
              {dict.hero.badge}
            </div>
            <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.15] font-extrabold mb-2 text-center">
              {dict.hero.title_part1}<br />{dict.hero.title_part2}
            </h1>
            <p className="inline-block bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xs border border-white/20 px-6 py-2 rounded-full text-base font-bold mb-4">
              {dict.hero.price_tag}
            </p>

            {/* Feature badges */}
            <div className="flex justify-center gap-2 flex-wrap mb-5">
              <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                {dict.hero.feature_sameday}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                {dict.hero.feature_free_pickup}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                {dict.hero.feature_clean}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex justify-center gap-3 flex-wrap mb-4">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center px-8 py-3 bg-white !text-[#1e3a8a] font-bold rounded-md shadow-lg hover:bg-gray-50 transition-colors"
              >
                {dict.hero.cta_sewa}
              </a>
              <a
                href={getWhatsAppUrl(WA_PRESET_ORDER, 'hero_cta')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#25d366] !text-white font-bold rounded-md shadow-lg hover:bg-[#1da851] transition-colors"
                data-wa-source="hero_cta"
                data-wa-location="hero"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                {dict.hero.cta_chat}
              </a>
            </div>

            {/* Direct contact */}
            <p className="text-sm text-white/70">
              {dict.hero.or_contact}{' '}
              <a href={getWhatsAppUrl(undefined, 'hero_phone')} className="text-white font-semibold hover:underline" data-wa-source="hero_phone" data-wa-location="hero">
                {config.whatsappDisplay}
              </a>
            </p>
          </div>
        </section>

        {/* Product Picker */}
        <div className="relative z-[10] -mt-10 md:-mt-20">
          <div
            id="calculator"
            style={{
              background: '#f8fafc',
              paddingTop: '2rem',
              paddingBottom: '1.5rem',
              borderRadius: '28px 28px 0 0',
              boxShadow: '0 -8px 40px rgba(30, 64, 175, 0.18)',
            }}
          >
            <h2 className="font-bold text-center text-slate-800" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', padding: '0 1rem' }}>
              {dict.hero.pick_title}
            </h2>
            <ProductPicker />
          </div>
        </div>
      </div>

      {/* Sticky Cart Bar */}
      <CartBar />

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">{dict.benefits.title}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            {dict.benefits.subtitle}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
            {benefits.map((b: { icon: string; title: string; desc: string }) => (
              <FeatureCard key={b.title} icon={b.icon} title={b.title} description={b.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== KARPET INTERNAL LINK ===== */}
      <section className="py-10 md:py-14 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-center shadow-sm md:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              {dict.karpet_internal.label}
            </p>
            <h2 className="mb-3 text-2xl font-extrabold text-slate-900">
              {dict.karpet_internal.title}
            </h2>
            <p className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              {dict.karpet_internal.desc}
            </p>
            <a
              href="https://karpet.santiliving.com/sewa-karpet-jogja"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white no-underline shadow-sm hover:bg-indigo-700"
            >
              {dict.karpet_internal.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ===== HOW TO RENT ===== */}
      <section className="py-10 md:py-14 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-6">
            {dict.steps.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {steps.map((s: { icon: string; title: string; desc: string }, i: number) => (
              <div key={i} className="text-center group">
                <div className="text-xl w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-border mx-auto mb-2 group-hover:border-primary transition-colors">
                  {s.icon}
                </div>
                <h3 className="text-xs font-bold mb-1">{s.title}</h3>
                <p className="text-[10px] leading-tight text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-12 md:py-16 bg-surface">
        <div className="max-w-2xl mx-auto px-4">
          <FAQAccordion items={faqItems} title={dict.faq.title} />
        </div>
      </section>

      {/* ===== PROMO ===== */}
      <section className="py-10 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
                {dict.promo.badge}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-white">{dict.promo.title}</h2>
              <p className="text-white/90 max-w-xl">
                {dict.promo.desc}
              </p>
            </div>
            <div className="flex shrink-0">
              <a 
                href="https://maps.app.goo.gl/DiUP3REYVqYBHtuA8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
              >
                {dict.promo.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section id="service-area" className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{dict.location.title}</h2>
              <p className="text-text-secondary mb-4 leading-relaxed">
                {dict.location.desc}
              </p>
              <address className="not-italic bg-surface p-5 rounded-xl border border-border mb-4">
                <p className="font-bold text-primary mb-1">{dict.location.workshop_name}</p>
                <p className="text-sm text-text-secondary mb-3">
                  Jl. Godean KM10, Geneng, Sidoagung,<br />
                  Kec. Godean, Kabupaten Sleman,<br />
                  DI Yogyakarta 55264
                </p>
                <a 
                  href="https://maps.app.goo.gl/DiUP3REYVqYBHtuA8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                >
                  {dict.location.maps_link}
                </a>
              </address>

              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{dict.location.service_areas_label}</p>
                <div className="flex flex-wrap gap-2">
                  {serviceAreas.map((area: string) => (
                    <span key={area} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card h-[300px] md:h-[350px] border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.1119565576723!2d110.2917015!3d-7.7673015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af78e36749823%3A0x52e28f33378aaa99!2zU2V3YSBLYXN1ciBKb2dqYSAtIFNhbnRpIExpdmluZyB8IGJ5IFNhbnRpIE1lYmVsIEpvZ2ph!5e0!3m2!1sen!2sid!4v1713400000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - Santi Living"
                suppressHydrationWarning
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3 text-center">{dict.cta_final.title}</h2>
          <p className="opacity-90 mb-8 leading-relaxed text-center">
            {dict.cta_final.desc}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#1e3a8a] font-bold rounded-md hover:bg-gray-50 transition-colors"
            >
              {dict.cta_final.cta_pesan}
            </a>
            <a
              href={getWhatsAppUrl(WA_PRESET_ORDER, 'footer_cta')}
              className="inline-flex items-center justify-center px-8 py-3 bg-[#25d366] text-white font-bold rounded-md hover:bg-[#1da851] transition-colors"
              target="_blank"
              rel="noopener"
              data-wa-source="footer_cta"
              data-wa-location="footer_cta"
            >
              {dict.cta_final.cta_chat}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
