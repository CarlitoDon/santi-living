import type { Metadata } from 'next';
import Link from 'next/link';
import { config } from '@/data/config';
import { JsonLd } from '@/components/seo/JsonLd';

type Locale = 'id' | 'en';

const serviceChoices = (locale: Locale) =>
  locale === 'en'
    ? [
        {
          number: '01',
          title: 'Rent a Mattress',
          description: 'Clean, comfortable mattresses for guests, family, and temporary stays.',
          href: `/${locale}/harga-sewa-kasur`,
        },
        {
          number: '02',
          title: 'Rent Chairs',
          description: 'Event chairs for weddings, meetings, gatherings, and family celebrations.',
          href: `/${locale}/sewa-kursi-acara`,
        },
        {
          number: '03',
          title: 'Rent Carpets',
          description: 'Carpets and rugs to make your event space feel more welcoming and ready.',
          href: `/${locale}/sewa-karpet-jogja`,
        },
      ]
    : [
        {
          number: '01',
          title: 'Sewa Kasur',
          description: 'Kasur bersih dan nyaman untuk tamu, keluarga, atau kebutuhan sementara.',
          href: `/${locale}/harga-sewa-kasur`,
        },
        {
          number: '02',
          title: 'Sewa Kursi',
          description: 'Kursi acara untuk pernikahan, rapat, pengajian, dan perayaan keluarga.',
          href: `/${locale}/sewa-kursi-acara`,
        },
        {
          number: '03',
          title: 'Sewa Karpet',
          description: 'Karpet dan permadani untuk membuat area acara lebih rapi dan nyaman.',
          href: `/${locale}/sewa-karpet-jogja`,
        },
      ];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';

  return locale === 'en'
    ? {
        title: 'Rent Mattresses, Chairs, or Carpets in Yogyakarta',
        description:
          'Choose what you need to rent from Santi Living in Yogyakarta: mattresses, event chairs, or carpets.',
        alternates: { canonical: `${config.siteUrl}/${locale}` },
        openGraph: {
          title: 'Rent Mattresses, Chairs, or Carpets | Santi Living',
          description: 'Choose your rental service and send us the details for availability and delivery.',
          url: `${config.siteUrl}/${locale}`,
          type: 'website',
        },
      }
    : {
        title: 'Mau Sewa Kasur, Kursi, atau Karpet di Jogja?',
        description:
          'Pilih kebutuhan sewa kamu di Santi Living Jogja: kasur, kursi acara, atau karpet. Kami bantu cek ketersediaan dan pengantaran.',
        alternates: { canonical: `${config.siteUrl}/${locale}` },
        openGraph: {
          title: 'Mau Sewa Kasur, Kursi, atau Karpet? | Santi Living',
          description: 'Pilih layanan sewa yang kamu butuhkan, lalu lihat detailnya.',
          url: `${config.siteUrl}/${locale}`,
          type: 'website',
        },
      };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';
  const isEnglish = locale === 'en';
  const choices = serviceChoices(locale);

  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    name: 'Santi Living',
    description: isEnglish
      ? 'Rental mattresses, event chairs, and carpets in Yogyakarta.'
      : 'Sewa kasur, kursi acara, dan karpet di Jogja.',
    url: `${config.siteUrl}/${locale}`,
    telephone: `+${config.whatsappNumber}`,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Jl. Godean KM 10 Geneng, RT.05/RW.04, Sidoagung, Kec. Godean',
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
    sameAs: ['https://www.instagram.com/santi.mebel/', 'https://www.facebook.com/santimebeljogja/'],
  };

  return (
    <main className="choice-home site-main-offset">
      <JsonLd data={localBusinessSchema} />

      <section className="choice-home-hero" aria-labelledby="choice-home-title">
        <div className="container choice-home-layout">
          <div className="choice-home-copy">
            <p className="choice-home-kicker">Santi Living / Yogyakarta</p>
            <h1 id="choice-home-title" className="choice-home-title">
              {isEnglish ? 'What do you need to rent?' : 'Mau sewa kasur, kursi, atau karpet?'}
            </h1>
            <p className="choice-home-intro">
              {isEnglish
                ? 'Choose one service to see the right details, then tell us your date, quantity, and delivery location.'
                : 'Pilih dulu kebutuhanmu. Setelah itu, lihat detail layanan dan kirim tanggal, jumlah, serta lokasi pengantaran.'}
            </p>
          </div>

          <aside className="choice-home-note" aria-label={isEnglish ? 'Santi Living service note' : 'Catatan layanan Santi Living'}>
            <span className="choice-home-note-mark" aria-hidden="true">SL</span>
            <p className="choice-home-note-label">
              {isEnglish ? 'Simple rental, clear next step' : 'Sewa simpel, langkah berikutnya jelas'}
            </p>
            <p>
              {isEnglish
                ? 'For home needs, guests, and events around Jogja.'
                : 'Untuk kebutuhan rumah, tamu, dan acara di sekitar Jogja.'}
            </p>
          </aside>
        </div>
      </section>

      <section className="choice-home-services" aria-labelledby="choice-home-services-title">
        <div className="container">
          <div className="choice-home-section-heading">
            <p className="choice-home-kicker">{isEnglish ? 'Choose a service' : 'Pilih layanan'}</p>
            <h2 id="choice-home-services-title">
              {isEnglish ? 'Start with what you need today.' : 'Mulai dari kebutuhanmu hari ini.'}
            </h2>
          </div>

          <nav className="choice-home-grid" aria-label={isEnglish ? 'Rental services' : 'Layanan sewa'}>
            {choices.map((choice) => (
              <Link href={choice.href} className="choice-home-card" key={choice.href}>
                <span className="choice-home-card-number">{choice.number}</span>
                <span className="choice-home-card-title">{choice.title}</span>
                <span className="choice-home-card-description">{choice.description}</span>
                <span className="choice-home-card-link">{isEnglish ? 'See service' : 'Lihat layanan'} <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="choice-home-footer-note" aria-label={isEnglish ? 'Rental process' : 'Cara mulai sewa'}>
        <div className="container choice-home-footer-note-inner">
          <p>{isEnglish ? 'Not sure which one?' : 'Masih bingung pilih yang mana?'}</p>
          <span>{isEnglish ? 'Open a service page first. We will help you check the practical details.' : 'Buka halaman layanan dulu. Kami bantu cek detail yang dibutuhkan.'}</span>
        </div>
      </section>
    </main>
  );
}
