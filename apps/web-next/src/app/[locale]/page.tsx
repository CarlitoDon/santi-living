import { config } from '@/data/config';
import { products } from '@/data/products';
import { AutoLocationTrigger } from '@/components/home/AutoLocationTrigger';
import { ProductPicker } from '@/components/home/ProductPicker';
import { CartBar } from '@/components/home/CartBar';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroBackground } from '@/components/home/HeroBackground';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { generateFAQSchema } from '@/utils/seo';
import { getWhatsAppUrl, WA_PRESET_ORDER } from '@/utils/whatsapp';
import { getStoreMapEmbedUrl } from '@/lib/store-location';
import { getDictionary, type Locale } from '@/locales/dictionary';

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 10 3.1 3.1L15 6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';
  const dict = await getDictionary(locale);
  const faqItems = dict.faq.items;
  const steps = dict.steps.items;
  const benefits = dict.benefits.items;
  const serviceAreas = dict.location.service_areas;
  const stripCheck = (value: string) => value.replace(/^✅\s*/, '');
  const serviceEyebrow = locale === 'en' ? 'Service you can count on' : 'Layanan yang bisa diandalkan';

  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    name: 'Santi Living',
    description: dict.seo.home_desc,
    url: 'https://santiliving.com',
    telephone: `+${config.whatsappNumber}`,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Jl. Godean KM 10 Geneng, RT.05/RW.04, Sidoagung, Kec. Godean, Sleman, DI Yogyakarta 55264',
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
    areaServed: serviceAreas.map((area) => ({ '@type': 'City' as const, name: area })),
    aggregateRating: {
      '@type': 'AggregateRating' as const,
      ratingValue: 5.0,
      reviewCount: 69,
      bestRating: 5,
    },
  };

  const productSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'Product' as const,
    name: locale === 'en' ? 'Santi Living Jogja Mattress Rental' : 'Sewa Kasur Busa Jogja Santi Living',
    description: dict.seo.home_desc,
    image: 'https://santiliving.com/logo.png',
    brand: { '@type': 'Brand' as const, name: 'Santi Living' },
    offers: {
      '@type': 'AggregateOffer' as const,
      lowPrice: 30000,
      highPrice: 70000,
      offerCount: products.mattressPackages.length + products.mattressOnly.length,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock' as const,
    },
    aggregateRating: {
      '@type': 'AggregateRating' as const,
      ratingValue: 5.0,
      reviewCount: 69,
      bestRating: 5,
    },
  };

  return (
    <main className="home-page site-main-offset">
      <AutoLocationTrigger />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={generateFAQSchema(faqItems)} />

      <div className="home-hero">
        <HeroBackground />
        <section className="home-hero-inner">
          <div className="container">
            <div className="home-hero-copy">
              <p className="home-eyebrow" data-reveal="up">{dict.hero.badge}</p>
              <h1 className="home-hero-title" data-reveal="up" data-reveal-delay="55">
                {dict.hero.title_part1} <span>{dict.hero.title_part2}</span>
              </h1>
              <p className="home-hero-lead" data-reveal="up" data-reveal-delay="110">
                {dict.benefits.subtitle}
              </p>

              <div className="home-hero-actions" data-reveal="up" data-reveal-delay="165">
                <a href="#calculator" className="home-primary-button motion-interactive motion-lift">
                  {dict.hero.cta_sewa} <ArrowRightIcon />
                </a>
                <a
                  href={getWhatsAppUrl(WA_PRESET_ORDER, 'hero_cta')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-secondary-button motion-interactive motion-lift"
                  data-wa-source="hero_cta"
                  data-wa-location="hero"
                >
                  <WhatsAppIcon /> {dict.hero.cta_chat}
                </a>
              </div>

              <ul
                className="home-trust-list"
                data-reveal="fade"
                data-reveal-delay="220"
                aria-label={locale === 'en' ? 'Service advantages' : 'Keunggulan layanan'}
              >
                <li><CheckIcon /> {stripCheck(dict.hero.feature_sameday)}</li>
                <li><CheckIcon /> {stripCheck(dict.hero.feature_clean)}</li>
                <li><CheckIcon /> {stripCheck(dict.hero.feature_free_pickup)}</li>
              </ul>

              <p className="home-direct-contact" data-reveal="fade" data-reveal-delay="250">
                {dict.hero.or_contact}{' '}
                <a href={getWhatsAppUrl(undefined, 'hero_phone')} data-wa-source="hero_phone" data-wa-location="hero">
                  {config.whatsappDisplay}
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>

      <section id="calculator" className="home-catalog" aria-labelledby="catalog-title">
        <div className="container home-catalog-inner">
          <div className="home-section-heading" data-reveal="up">
            <p className="section-eyebrow">{dict.hero.pick_title}</p>
            <h2 id="catalog-title">{dict.produk.title}</h2>
            <p>{dict.produk.subtitle}</p>
          </div>
          <ProductPicker />
        </div>
      </section>

      <CartBar />

      <section className="home-section" aria-labelledby="benefits-title">
        <div className="container">
          <div className="home-section-heading centered" data-reveal="up">
            <p className="section-eyebrow">{serviceEyebrow}</p>
            <h2 id="benefits-title">{dict.benefits.title}</h2>
            <p>{dict.benefits.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} data-reveal="up" data-reveal-delay={String((index % 3) * 55)}>
                <FeatureCard icon={benefit.icon} title={benefit.title} description={benefit.desc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cross-sell">
        <div className="container home-cross-sell-inner">
          <div data-reveal="left">
            <p className="section-eyebrow">{dict.karpet_internal.label}</p>
            <h2>{dict.karpet_internal.title}</h2>
            <p>{dict.karpet_internal.desc}</p>
          </div>
          <a href="https://karpet.santiliving.com/sewa-karpet-jogja" className="home-text-link motion-interactive motion-lift" data-reveal="right">
            {dict.karpet_internal.cta} <ArrowRightIcon />
          </a>
        </div>
      </section>

      <section className="home-section home-section-soft" aria-labelledby="steps-title">
        <div className="container">
          <div className="home-section-heading" data-reveal="up">
            <p className="section-eyebrow">{dict.steps.title}</p>
            <h2 id="steps-title">{dict.steps.title}</h2>
          </div>
          <ol className="home-steps">
            {steps.map((step, index) => (
              <li className="home-step" key={step.title} data-reveal="up" data-reveal-delay={String(index * 45)}>
                <span className="home-step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section" aria-labelledby="faq-title">
        <div className="container">
          <div className="max-w-2xl mx-auto" data-reveal="up">
            <FAQAccordion items={faqItems} title={dict.faq.title} titleId="faq-title" />
          </div>
        </div>
      </section>

      <section className="home-promo">
        <div className="container home-promo-inner">
          <div data-reveal="left">
            <p className="home-promo-label">{dict.promo.badge}</p>
            <h2>{dict.promo.title}</h2>
            <p>{dict.promo.desc}</p>
          </div>
          <a href={config.storeLocation.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="home-text-link motion-interactive motion-lift" data-reveal="right">
            {dict.promo.cta} <ArrowRightIcon />
          </a>
        </div>
      </section>

      <section id="service-area" className="home-section home-section-soft" aria-labelledby="location-title">
        <div className="container home-location-grid">
          <div data-reveal="left">
            <div className="home-section-heading">
              <p className="section-eyebrow">{dict.location.title}</p>
              <h2 id="location-title">{dict.location.workshop_name}</h2>
              <p>{dict.location.desc}</p>
            </div>
            <address className="home-address">
              <strong>{dict.location.workshop_name}</strong>
              <p>Jl. Godean KM 10 Geneng, RT.05/RW.04, Sidoagung,<br />Kec. Godean, Kabupaten Sleman, DI Yogyakarta 55264</p>
              <a href={config.storeLocation.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-sm hover:underline">
                {dict.location.maps_link}
              </a>
            </address>
            <ul className="home-area-list" aria-label={dict.location.service_areas_label}>
              {serviceAreas.map((area) => <li key={area}>{area}</li>)}
            </ul>
          </div>
          <div className="home-map" data-reveal="right">
            <iframe
              src={getStoreMapEmbedUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 'inherit' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Santi Living"
              suppressHydrationWarning
            />
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="container home-final-cta-inner">
          <div data-reveal="left">
            <h2>{dict.cta_final.title}</h2>
            <p>{dict.cta_final.desc}</p>
          </div>
          <div className="home-hero-actions" data-reveal="right">
            <a href="#calculator" className="home-primary-button motion-interactive motion-lift">{dict.cta_final.cta_pesan} <ArrowRightIcon /></a>
            <a
              href={getWhatsAppUrl(WA_PRESET_ORDER, 'footer_cta')}
              className="home-secondary-button motion-interactive motion-lift"
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="footer_cta"
              data-wa-location="footer_cta"
            >
              <WhatsAppIcon /> {dict.cta_final.cta_chat}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
