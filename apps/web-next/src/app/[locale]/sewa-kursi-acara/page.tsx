import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/data/config';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';
import { JsonLd } from '@/components/seo/JsonLd';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';

type Locale = 'id' | 'en';

const CHAIR_PAGE_PATH = '/sewa-kursi-acara';
const CHAIR_HERO_IMAGE = '/images/kursi-acara-jogja-katalog.png';
const CHAIR_PICKUP_IMAGE = '/images/kursi-acara-jogja-pickup.png';
const CHAIR_PROFILE_NAME = 'Sewa Kursi Acara Jogja – Santi Living | by Santi Mebel Jogja';
const CHAIR_PROFILE_URL = 'https://www.google.com/maps?cid=15162930286234518743';
const CHAIR_WA_TEXT = `Halo Santi Living, saya ingin cek sewa kursi acara Jogja.

Jenis acara:
Jenis kursi:
Jumlah kursi:
Tanggal acara:
Lokasi pengantaran:
Akses venue (lantai/jam bongkar):

Mohon info ketersediaan, ongkir, dan cara sewa.`;

const chairMetadata = {
  id: {
    title: 'Sewa Kursi Acara Jogja',
    description:
      'Sewa kursi Jogja untuk acara: kursi lipat, kursi susun besi spons, dan kursi plastik. Kirim tanggal, jumlah, dan lokasi untuk cek ketersediaan serta pengantaran via WhatsApp.',
    keywords: [
      'sewa kursi jogja',
      'sewa kursi acara jogja',
      'sewa kursi yogyakarta',
      'kursi lipat',
      'kursi susun besi spons',
      'kursi plastik',
    ],
    imageAlt: 'Katalog kursi acara untuk sewa kursi Jogja',
  },
  en: {
    title: 'Event Chair Rental Yogyakarta',
    description:
      'Rent event chairs in Yogyakarta: folding chairs, stackable padded steel chairs, and plastic chairs. Send your date, quantity, and delivery location so we can check availability and logistics via WhatsApp.',
    keywords: [
      'event chair rental yogyakarta',
      'event chair rental jogja',
      'folding chair rental yogyakarta',
      'stackable padded steel chair rental',
      'plastic chair rental yogyakarta',
    ],
    imageAlt: 'Event chair rental options in Yogyakarta',
  },
} satisfies Record<Locale, { title: string; description: string; keywords: string[]; imageAlt: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';
  const pageUrl = localizedSiteUrl(CHAIR_PAGE_PATH, locale);
  const metadata = chairMetadata[locale];
  const heroImageUrl = primarySiteUrl(CHAIR_HERO_IMAGE);

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        id: localizedSiteUrl(CHAIR_PAGE_PATH, 'id'),
        en: localizedSiteUrl(CHAIR_PAGE_PATH, 'en'),
        'x-default': localizedSiteUrl(CHAIR_PAGE_PATH, 'id'),
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      url: pageUrl,
      siteName: config.businessName,
      title: metadata.title,
      description: metadata.description,
      images: [{ url: heroImageUrl, width: 1448, height: 1086, alt: metadata.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [heroImageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SewaKursiAcaraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';
  const isEnglish = locale === 'en';

  const copy = isEnglish
    ? {
        back: 'All rental services',
        eyebrow: 'Event chair rental / Yogyakarta',
        title: 'Event Chair Rental Yogyakarta',
        intro:
          'Looking for event chair rental in Yogyakarta? Choose the chair style that fits your event. Send us the date, quantity, and delivery location so we can check availability and logistics.',
        primaryCta: 'Check availability on WhatsApp',
        phone: '0895-1911-9092',
        catalogEyebrow: 'Chair options',
        catalogTitle: 'Chair options for events in Yogyakarta.',
        catalogIntro: 'The final recommendation follows your event format, quantity, date, and venue access.',
        detailsEyebrow: 'Before you chat',
        detailsTitle: 'Three details help us answer faster.',
        detailsIntro: 'Prepare these details before sending an inquiry:',
        details: ['Event date and time', 'Number of chairs', 'Delivery location and access'],
        detailsCta: 'Send event details',
        trustItems: ['Availability checked by date', 'Delivery logistics confirmed first', 'WhatsApp inquiry without price guesswork'],
        fitEyebrow: 'For your event',
        fitTitle: 'A chair setup that follows the room, not the other way around.',
        fitItems: [
          { title: 'Meetings and gatherings', description: 'Keep seating flexible for meetings, community gatherings, and family events.' },
          { title: 'Guest and ceremony areas', description: 'Use stackable seating when the layout needs a tidy guest area and efficient storage.' },
          { title: 'Larger practical layouts', description: 'Ask about plastic chairs when the event needs a simple setup for a larger group.' },
        ],
        processEyebrow: 'How it works',
        processTitle: 'Three steps to get a realistic answer.',
        processSteps: [
          { number: '01', title: 'Send event details', description: 'Tell us the chair type, quantity, event date, and delivery location.' },
          { number: '02', title: 'Check stock and route', description: 'Admin checks the matching stock, delivery route, venue access, and schedule.' },
          { number: '03', title: 'Confirm the booking', description: 'Continue only after the option, estimate, and delivery plan fit your event.' },
        ],
        faqEyebrow: 'Before you order',
        faqTitle: 'Questions about renting chairs in Jogja.',
        faqs: [
          { question: 'What chair types can I ask about?', answer: 'You can ask about folding chairs, stackable padded steel chairs, and plastic chairs. The final option depends on the event date, quantity, and stock.' },
          { question: 'Can I get the rental price directly from the page?', answer: 'The estimate is confirmed via WhatsApp after the date, quantity, location, route, and venue access are known. This avoids promising a price that does not fit the delivery details.' },
          { question: 'Does Santi Living deliver to my venue?', answer: 'Send the complete venue address and access information. The team will check the route, unloading time, and delivery feasibility before confirming.' },
          { question: 'How early should I inquire?', answer: 'Earlier is better for larger quantities or fixed event dates. Same-day or short-notice requests still need a stock and route check first.' },
        ],
        finalCtaTitle: 'Ready to check chairs for your event?',
        finalCtaText: 'Send the date, quantity, chair preference, and venue. We will help check the most realistic option before you confirm.',
        finalCtaLabel: 'Cek kursi via WhatsApp',
        locationTitle: 'Chair service point in Gamping',
        locationText: 'Pelemgurih, Banyuraden, Kec. Gamping, Sleman, DI Yogyakarta 55293, near Santi Mebel Jogja I Gamping.',
        locationCta: 'Open Google Maps',
        pickupAlt: 'Pickup from Santi Mebel carrying event chairs',
        pickupCaption: 'Pickup and delivery are checked against the date, quantity, route, and venue access.',
      }
    : {
        back: 'Semua layanan sewa',
        eyebrow: 'Sewa kursi acara / Yogyakarta',
        title: 'Sewa Kursi Acara Jogja',
        intro:
          'Butuh sewa kursi Jogja untuk acara? Pilih jenis kursi yang paling sesuai. Kirim tanggal, jumlah, dan lokasi pengantaran agar kami bisa cek ketersediaan serta logistiknya.',
        primaryCta: 'Cek ketersediaan via WhatsApp',
        phone: '0895-1911-9092',
        catalogEyebrow: 'Pilihan kursi',
        catalogTitle: 'Pilihan kursi untuk acara di Jogja.',
        catalogIntro: 'Rekomendasi akhirnya mengikuti format acara, jumlah, tanggal, dan akses venue.',
        detailsEyebrow: 'Sebelum chat',
        detailsTitle: 'Tiga informasi membantu kami menjawab lebih cepat.',
        detailsIntro: 'Siapkan informasi ini sebelum mengirim pertanyaan:',
        details: ['Tanggal dan jam acara', 'Jumlah kursi yang dibutuhkan', 'Lokasi pengantaran dan akses venue'],
        detailsCta: 'Kirim detail acara',
        trustItems: ['Ketersediaan dicek berdasarkan tanggal', 'Logistik pengantaran dikonfirmasi dulu', 'Konsultasi WhatsApp tanpa tebak harga'],
        fitEyebrow: 'Untuk acara Anda',
        fitTitle: 'Susunan kursi mengikuti ruang dan kebutuhan acara.',
        fitItems: [
          { title: 'Rapat dan gathering', description: 'Jaga susunan tetap fleksibel untuk rapat, kumpul komunitas, dan acara keluarga.' },
          { title: 'Area tamu dan seremoni', description: 'Kursi susun membantu area tamu tetap rapi saat layout perlu diubah atau diringkas.' },
          { title: 'Layout praktis jumlah besar', description: 'Kursi plastik bisa dipertimbangkan untuk susunan sederhana dan kelompok yang lebih besar.' },
        ],
        processEyebrow: 'Cara sewa',
        processTitle: 'Tiga langkah untuk mendapat jawaban yang realistis.',
        processSteps: [
          { number: '01', title: 'Kirim detail acara', description: 'Sampaikan jenis kursi, jumlah, tanggal acara, dan lokasi pengantaran.' },
          { number: '02', title: 'Cek stok dan rute', description: 'Admin mengecek stok yang sesuai, rute, akses venue, dan jadwal pengantaran.' },
          { number: '03', title: 'Konfirmasi pesanan', description: 'Lanjutkan setelah pilihan, estimasi, dan rencana pengantaran cocok dengan kebutuhan acara.' },
        ],
        faqEyebrow: 'Sebelum pesan',
        faqTitle: 'Pertanyaan tentang sewa kursi di Jogja.',
        faqs: [
          { question: 'Jenis kursi apa yang bisa ditanyakan?', answer: 'Anda bisa menanyakan kursi lipat, kursi susun besi spons, dan kursi plastik. Pilihan akhirnya mengikuti tanggal acara, jumlah, dan stok yang tersedia.' },
          { question: 'Apakah harga sewa langsung tercantum di halaman?', answer: 'Estimasi dikonfirmasi melalui WhatsApp setelah tanggal, jumlah, lokasi, rute, dan akses venue diketahui. Dengan begitu harga tidak dijanjikan secara keliru sebelum detail pengantaran jelas.' },
          { question: 'Apakah bisa diantar ke venue saya?', answer: 'Kirim alamat venue lengkap beserta informasi aksesnya. Tim akan mengecek rute, waktu bongkar, dan kelayakan pengantaran sebelum konfirmasi.' },
          { question: 'Sebaiknya pesan berapa lama sebelumnya?', answer: 'Semakin awal semakin baik, terutama untuk jumlah besar atau tanggal acara yang sudah tetap. Permintaan mendadak tetap perlu dicek stok dan rutenya terlebih dahulu.' },
        ],
        finalCtaTitle: 'Siap cek kursi untuk acara Anda?',
        finalCtaText: 'Kirim tanggal, jumlah, pilihan kursi, dan venue. Kami bantu cek opsi yang paling realistis sebelum Anda konfirmasi.',
        finalCtaLabel: 'Cek kursi via WhatsApp',
        locationTitle: 'Titik layanan kursi di Gamping',
        locationText: 'Pelemgurih, Banyuraden, Kec. Gamping, Sleman, DI Yogyakarta 55293, dekat Santi Mebel Jogja I Gamping.',
        locationCta: 'Buka Google Maps',
        pickupAlt: 'Pickup Santi Mebel sedang mengangkut banyak kursi acara',
        pickupCaption: 'Pengantaran dan pickup dicek berdasarkan tanggal, jumlah, rute, serta akses venue.',
      };

  const chairTypes = isEnglish
    ? [
        {
          number: '01',
          title: 'Folding chair',
          description: 'A practical option for flexible seating, meetings, gatherings, and family events.',
          tone: 'light',
          image: '/images/kursi-lipat-merah.webp',
          imageAlt: 'Folding red chair available to check for event rental',
        },
        {
          number: '02',
          title: 'Stackable padded steel chair',
          description: 'A stackable chair with a chrome frame and red padded seat and back for guest areas.',
          tone: 'dark',
          image: '/images/kursi-susun-merah.webp',
          imageAlt: 'Stackable padded steel chair available to check for event rental',
        },
        {
          number: '03',
          title: 'Plastic chair',
          description: 'A simple, easy-to-arrange option for practical event layouts and larger groups.',
          tone: 'green',
          image: '/images/kursi-plastik-biru.webp',
          imageAlt: 'Blue plastic chair available to check for event rental',
        },
      ]
    : [
        {
          number: '01',
          title: 'Kursi lipat',
          description: 'Pilihan praktis untuk susunan fleksibel, rapat, kumpul keluarga, dan acara sederhana.',
          tone: 'light',
          image: '/images/kursi-lipat-merah.webp',
          imageAlt: 'Kursi lipat merah untuk ditanyakan dalam sewa kursi acara',
        },
        {
          number: '02',
          title: 'Kursi susun besi spons',
          description: 'Kursi susun dengan rangka krom serta dudukan dan sandaran spons merah untuk area tamu.',
          tone: 'dark',
          image: '/images/kursi-susun-merah.webp',
          imageAlt: 'Kursi susun besi spons untuk ditanyakan dalam sewa kursi acara',
        },
        {
          number: '03',
          title: 'Kursi plastik',
          description: 'Pilihan sederhana dan mudah ditata untuk layout acara yang praktis dan jumlah besar.',
          tone: 'green',
          image: '/images/kursi-plastik-biru.webp',
          imageAlt: 'Kursi plastik biru untuk ditanyakan dalam sewa kursi acara',
        },
      ];

  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    '@id': `${PRIMARY_SITE_URL}#santi-living`,
    name: CHAIR_PROFILE_NAME,
    description: isEnglish
      ? 'Event chair rental in Yogyakarta: folding chairs, stackable padded steel chairs, and plastic chairs.'
      : 'Sewa kursi acara di Jogja: kursi lipat, kursi susun besi spons, dan kursi plastik.',
    url: localizedSiteUrl(CHAIR_PAGE_PATH, locale),
    image: [primarySiteUrl(CHAIR_HERO_IMAGE), primarySiteUrl(CHAIR_PICKUP_IMAGE)],
    telephone: `+${config.whatsappNumber}`,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Pelemgurih, Banyuraden, Kec. Gamping',
      addressLocality: 'Sleman',
      addressRegion: 'DI Yogyakarta',
      postalCode: '55293',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: -7.800111,
      longitude: 110.330417,
    },
    sameAs: ['https://www.instagram.com/santi.mebel/', 'https://www.facebook.com/santimebeljogja/'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog' as const,
      name: isEnglish ? 'Event chair rental options' : 'Pilihan sewa kursi acara',
      itemListElement: chairTypes.map((chair) => ({
        '@type': 'Offer' as const,
        itemOffered: {
          '@type': 'Service' as const,
          name: chair.title,
          description: chair.description,
          url: localizedSiteUrl(CHAIR_PAGE_PATH, locale),
        },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: copy.faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="chair-page site-main-offset">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      <section className="chair-hero" aria-labelledby="chair-page-title">
        <div className="container chair-hero-grid">
          <div className="chair-hero-copy">
            <Link href={`/${locale}`} className="chair-back-link">← {copy.back}</Link>
            <p className="chair-eyebrow">{copy.eyebrow}</p>
            <h1 id="chair-page-title">{copy.title}</h1>
            <p className="chair-hero-intro">{copy.intro}</p>
            <WhatsAppLink
              message={CHAIR_WA_TEXT}
              source="chair_lp_hero"
              location="chair_hero"
              data-product-category="kursi"
              data-page-type="landing"
              data-wa-intent="sewa_kursi_acara"
              className="chair-button chair-button-primary"
            >
              {copy.primaryCta} <span aria-hidden="true">↗</span>
            </WhatsAppLink>
            <p className="chair-phone">WhatsApp {copy.phone}</p>
            <ul className="chair-hero-proof" aria-label={isEnglish ? 'Service notes' : 'Catatan layanan'}>
              {copy.trustItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="chair-hero-media">
            <Image
              src={CHAIR_HERO_IMAGE}
              alt={isEnglish ? 'Folding and stackable padded steel chairs prepared for an event' : 'Kursi lipat dan kursi susun besi spons yang disiapkan untuk acara'}
              width={1448}
              height={1086}
              priority
              sizes="(max-width: 767px) 92vw, 48vw"
            />
            <span className="chair-media-tag">{isEnglish ? 'Santi Living / event seating' : 'Santi Living / kursi acara'}</span>
          </div>
        </div>
      </section>

      <section className="chair-trust-strip" aria-label={isEnglish ? 'Rental service highlights' : 'Keunggulan layanan sewa'}>
        <div className="container chair-trust-grid">
          {copy.trustItems.map((item, index) => (
            <div className="chair-trust-item" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="chair-catalog" aria-labelledby="chair-catalog-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.catalogEyebrow}</p>
            <h2 id="chair-catalog-title">{copy.catalogTitle}</h2>
            <p>{copy.catalogIntro}</p>
          </div>
          <div className="chair-type-grid">
            {chairTypes.map((chair) => (
              <article className={`chair-type-card chair-type-card-${chair.tone}`} key={chair.title}>
                <Image src={chair.image} alt={chair.imageAlt} width={720} height={900} sizes="(max-width: 800px) 92vw, 30vw" />
                <span className="chair-type-number">{chair.number}</span>
                <h3>{chair.title}</h3>
                <p>{chair.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chair-fit" aria-labelledby="chair-fit-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.fitEyebrow}</p>
            <h2 id="chair-fit-title">{copy.fitTitle}</h2>
          </div>
          <div className="chair-fit-grid">
            {copy.fitItems.map((item, index) => (
              <article className="chair-fit-card" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chair-process" aria-labelledby="chair-process-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.processEyebrow}</p>
            <h2 id="chair-process-title">{copy.processTitle}</h2>
          </div>
          <ol className="chair-process-grid">
            {copy.processSteps.map((step) => (
              <li className="chair-process-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="chair-details" aria-labelledby="chair-details-title">
        <div className="container chair-details-grid">
          <div>
            <p className="chair-eyebrow">{copy.detailsEyebrow}</p>
            <h2 id="chair-details-title">{copy.detailsTitle}</h2>
            <p className="chair-details-intro">{copy.detailsIntro}</p>
            <ol className="chair-detail-list">
              {copy.details.map((detail, index) => (
                <li key={detail}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{detail}</strong>
                </li>
              ))}
            </ol>
            <WhatsAppLink
              message={CHAIR_WA_TEXT}
              source="chair_lp_details"
              location="chair_details"
              data-product-category="kursi"
              data-page-type="landing"
              data-wa-intent="sewa_kursi_acara"
              className="chair-button chair-button-light"
            >
              {copy.detailsCta} <span aria-hidden="true">↗</span>
            </WhatsAppLink>
          </div>

          <figure className="chair-pickup-card">
            <Image
              src={CHAIR_PICKUP_IMAGE}
              alt={copy.pickupAlt}
              width={1448}
              height={1086}
              sizes="(max-width: 767px) 92vw, 42vw"
            />
            <figcaption>{copy.pickupCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="chair-faq" aria-labelledby="chair-faq-title">
        <div className="container chair-faq-inner">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.faqEyebrow}</p>
            <h2 id="chair-faq-title">{copy.faqTitle}</h2>
          </div>
          <div className="chair-faq-list">
            {copy.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="chair-final-cta" aria-labelledby="chair-final-cta-title">
        <div className="container chair-final-cta-inner">
          <div>
            <p className="chair-eyebrow">Santi Living / WhatsApp</p>
            <h2 id="chair-final-cta-title">{copy.finalCtaTitle}</h2>
            <p>{copy.finalCtaText}</p>
          </div>
          <WhatsAppLink
            message={CHAIR_WA_TEXT}
            source="chair_lp_bottom"
            location="chair_bottom"
            data-product-category="kursi"
            data-page-type="landing"
            data-wa-intent="sewa_kursi_acara"
            className="chair-button chair-button-light"
          >
            {copy.finalCtaLabel} <span aria-hidden="true">↗</span>
          </WhatsAppLink>
        </div>
      </section>

      <section className="chair-location" aria-labelledby="chair-location-title">
        <div className="container chair-location-inner">
          <div>
            <p className="chair-eyebrow">Santi Living / Gamping</p>
            <h2 id="chair-location-title">{copy.locationTitle}</h2>
            <p>{copy.locationText}</p>
          </div>
          <a href={CHAIR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="chair-button chair-button-outline">
            {copy.locationCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
