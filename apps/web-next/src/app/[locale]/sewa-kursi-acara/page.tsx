import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/data/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { getWhatsAppUrl } from '@/utils/whatsapp';

type Locale = 'id' | 'en';

const CHAIR_PROFILE_NAME = 'Sewa Kursi Acara Jogja – Santi Living | by Santi Mebel Jogja';
const CHAIR_PROFILE_URL = 'https://www.google.com/maps?cid=15162930286234518743';
const CHAIR_WA_TEXT = `Halo Santi Living, saya ingin cek sewa kursi acara Jogja.

Jenis kursi:
Jumlah kursi:
Tanggal acara:
Lokasi pengantaran:

Mohon info ketersediaan, ongkir, dan cara sewa.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';

  return locale === 'en'
    ? {
        title: 'Event Chair Rental Yogyakarta',
        description:
          'Rent folding chairs, hotel or stackable padded chairs, and plastic chairs for events in Yogyakarta.',
        alternates: { canonical: `${config.siteUrl}/${locale}/sewa-kursi-acara` },
      }
    : {
        title: 'Sewa Kursi Acara Jogja',
        description:
          'Sewa kursi lipat, kursi hotel atau tumpuk besi spons, dan kursi plastik untuk acara di Jogja. Cek ketersediaan dan pengantaran via WhatsApp.',
        alternates: { canonical: `${config.siteUrl}/${locale}/sewa-kursi-acara` },
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
          'Choose the chair style that fits your event. Send us the date, quantity, and delivery location so we can check availability and logistics.',
        primaryCta: 'Check availability on WhatsApp',
        phone: '0895-1911-9092',
        catalogEyebrow: 'Chair options',
        catalogTitle: 'Three practical choices for an event.',
        catalogIntro: 'The final recommendation follows your event format, quantity, date, and venue access.',
        detailsEyebrow: 'Before you chat',
        detailsTitle: 'Three details help us answer faster.',
        detailsIntro: 'Prepare these details before sending an inquiry:',
        details: ['Event date and time', 'Number of chairs', 'Delivery location and access'],
        detailsCta: 'Send event details',
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
          'Pilih jenis kursi yang paling sesuai. Kirim tanggal, jumlah, dan lokasi pengantaran agar kami bisa cek ketersediaan serta logistiknya.',
        primaryCta: 'Cek ketersediaan via WhatsApp',
        phone: '0895-1911-9092',
        catalogEyebrow: 'Pilihan kursi',
        catalogTitle: 'Tiga pilihan praktis untuk acara.',
        catalogIntro: 'Rekomendasi akhirnya mengikuti format acara, jumlah, tanggal, dan akses venue.',
        detailsEyebrow: 'Sebelum chat',
        detailsTitle: 'Tiga informasi membantu kami menjawab lebih cepat.',
        detailsIntro: 'Siapkan informasi ini sebelum mengirim pertanyaan:',
        details: ['Tanggal dan jam acara', 'Jumlah kursi yang dibutuhkan', 'Lokasi pengantaran dan akses venue'],
        detailsCta: 'Kirim detail acara',
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
        },
        {
          number: '02',
          title: 'Hotel / stackable padded chair',
          description: 'A more formal look for weddings, ceremonies, meetings, and guest seating.',
          tone: 'dark',
        },
        {
          number: '03',
          title: 'Plastic chair',
          description: 'A simple, easy-to-arrange option for practical event layouts and larger groups.',
          tone: 'green',
        },
      ]
    : [
        {
          number: '01',
          title: 'Kursi lipat',
          description: 'Pilihan praktis untuk susunan fleksibel, rapat, kumpul keluarga, dan acara sederhana.',
          tone: 'light',
        },
        {
          number: '02',
          title: 'Kursi hotel / tumpuk besi spons',
          description: 'Tampilan lebih formal untuk pernikahan, seremoni, rapat, dan tempat duduk tamu.',
          tone: 'dark',
        },
        {
          number: '03',
          title: 'Kursi plastik',
          description: 'Pilihan sederhana dan mudah ditata untuk layout acara yang praktis dan jumlah besar.',
          tone: 'green',
        },
      ];

  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    name: CHAIR_PROFILE_NAME,
    description: isEnglish
      ? 'Event chair rental in Yogyakarta: folding chairs, hotel or stackable padded chairs, and plastic chairs.'
      : 'Sewa kursi acara di Jogja: kursi lipat, kursi hotel atau tumpuk besi spons, dan kursi plastik.',
    url: `${config.siteUrl}/${locale}/sewa-kursi-acara`,
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
        },
      })),
    },
  };

  return (
    <main className="chair-page site-main-offset">
      <JsonLd data={localBusinessSchema} />

      <section className="chair-hero" aria-labelledby="chair-page-title">
        <div className="container chair-hero-grid">
          <div className="chair-hero-copy">
            <Link href={`/${locale}`} className="chair-back-link">← {copy.back}</Link>
            <p className="chair-eyebrow">{copy.eyebrow}</p>
            <h1 id="chair-page-title">{copy.title}</h1>
            <p className="chair-hero-intro">{copy.intro}</p>
            <a
              href={getWhatsAppUrl(CHAIR_WA_TEXT, 'chair_page')}
              target="_blank"
              rel="noopener noreferrer"
              className="chair-button chair-button-primary"
              data-wa-source="chair_page"
              data-wa-location="chair_hero"
            >
              {copy.primaryCta} <span aria-hidden="true">↗</span>
            </a>
            <p className="chair-phone">WhatsApp {copy.phone}</p>
          </div>

          <div className="chair-hero-media">
            <Image
              src="/images/kursi-acara-jogja-katalog.png"
              alt={isEnglish ? 'Folding and hotel chairs prepared for an event' : 'Kursi lipat dan kursi hotel yang disiapkan untuk acara'}
              width={1448}
              height={1086}
              priority
              sizes="(max-width: 767px) 92vw, 48vw"
            />
            <span className="chair-media-tag">Santi Living / event seating</span>
          </div>
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
                <span className="chair-type-number">{chair.number}</span>
                <h3>{chair.title}</h3>
                <p>{chair.description}</p>
              </article>
            ))}
          </div>
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
            <a
              href={getWhatsAppUrl(CHAIR_WA_TEXT, 'chair_details')}
              target="_blank"
              rel="noopener noreferrer"
              className="chair-button chair-button-light"
              data-wa-source="chair_details"
              data-wa-location="chair_details"
            >
              {copy.detailsCta} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <figure className="chair-pickup-card">
            <Image
              src="/images/kursi-acara-jogja-pickup.png"
              alt={copy.pickupAlt}
              width={1448}
              height={1086}
              sizes="(max-width: 767px) 92vw, 42vw"
            />
            <figcaption>{copy.pickupCaption}</figcaption>
          </figure>
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
