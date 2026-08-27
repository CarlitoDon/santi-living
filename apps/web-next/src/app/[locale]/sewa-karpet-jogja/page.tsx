import type { Metadata } from 'next';
import { SewaKarpetContent } from './SewaKarpetContent';

const PAGE_PATH = 'https://karpet.santiliving.com/sewa-karpet-jogja';

const PAGE_TITLE =
  'Sewa Karpet & Permadani Jogja — Harga Mulai Rp25.000/Hari | Santi Living';

const PAGE_DESCRIPTION =
  'Sewa karpet & permadani Jogja mulai Rp25.000/hari untuk tahlilan, aqiqah, pengajian, pernikahan, arisan, dan event komunitas. Wilayah Sleman, Kota Jogja, Bantul, Kulon Progo. Anta jemput, free konsultasi.';

const FAQ_ITEMS = [
  {
    question: 'Berapa harga sewa karpet di Jogja?',
    answer:
      'Harga sewa karpet Santi Living mulai dari Rp25.000/hari untuk karpet polos. Karpet permadani dan motif mulai Rp40.000/hari, sedangkan karpet merah VIP mulai Rp60.000/hari. Harga akhir mengikuti ukuran area, durasi, lokasi pengiriman, dan jenis karpet yang dipilih.',
  },
  {
    question: 'Jenis karpet apa saja yang tersedia untuk disewa?',
    answer:
      'Santi Living menyediakan tiga kategori utama: karpet polos (Rp25.000-40.000/hari), karpet permadani/motif (Rp40.000-75.000/hari), dan karpet merah VIP (Rp60.000-100.000/hari). Setiap kategori cocok untuk jenis acara yang berbeda.',
  },
  {
    question: 'Acara apa saja yang bisa pakai sewa karpet Santi Living?',
    answer:
      'Karpet bisa digunakan untuk tahlilan, aqiqah, pengajian, pernikahan, arisan, serta event dan komunitas. Admin bantu menyesuaikan jenis karpet dengan jenis acara agar tampilan venue lebih rapi dan nyaman.',
  },
  {
    question: 'Area mana saja yang dilayani untuk sewa karpet?',
    answer:
      'Area layanan mencakup Sleman, Kota Jogja, Bantul, dan Kulon Progo. Estimasi ongkir menyesuaikan alamat lengkap, akses kendaraan, jam kirim, dan jam jemput.',
  },
  {
    question: 'Bagaimana cara pesan sewa karpet via WhatsApp?',
    answer:
      'Kirim pesan ke 0895-1911-9092 dengan menyertakan jenis acara, tanggal, lokasi, ukuran area, jenis karpet yang diinginkan, dan apakah butuh perlengkapan tambahan. Admin akan merespons dengan ketersediaan dan estimasi harga.',
  },
  {
    question: 'Apakah bisa sewa karpet plus kasur dan perlengkapan acara lain?',
    answer:
      'Bisa. Santi Living juga menyediakan kasur tamu, bantal, kipas angin, air cooler, dan TV display yang bisa dikonsultasikan sebagai paket acara. Ketersediaan dicek berdasarkan jadwal dan lokasi.',
  },
];

const PRICING_ITEMS = [
  {
    name: 'Karpet Polos',
    price: 'Rp25.000 - Rp40.000',
    unit: '/hari',
    description:
      'Cocok untuk acara sederhana, tahlilan, pengajian rutin, dan kebutuhan alas duduk lesehan.',
  },
  {
    name: 'Karpet Permadani / Motif',
    price: 'Rp40.000 - Rp75.000',
    unit: '/hari',
    description:
      'Tersedia berbagai motif dan warna. Cocok untuk aqiqah, arisan, ruang tamu sementara, dan acara keluarga.',
  },
  {
    name: 'Karpet Merah VIP',
    price: 'Rp60.000 - Rp100.000',
    unit: '/hari',
    description:
      'Untuk pernikahan, event formal, jalur karpet merah, dan acara komunitas yang membutuhkan tampilan premium.',
  },
];

const EVENT_TYPES = [
  { name: 'Tahlilan', description: 'Permadani untuk duduk lesehan jamaah dan keluarga.' },
  { name: 'Aqiqah', description: 'Karpet motif untuk area tamu dan keluarga.' },
  { name: 'Pengajian', description: 'Permadani emas atau merah untuk area jamaah.' },
  { name: 'Pernikahan', description: 'Karpet merah VIP untuk jalur tamu dan seremoni.' },
  { name: 'Arisan', description: 'Karpet polos atau motif untuk area kumpul.' },
  { name: 'Event / Komunitas', description: 'Karpet booth atau runner untuk seminar dan pameran.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Sewa Karpet & Permadani Jogja',
  serviceType: 'Karpet Rental',
  description: PAGE_DESCRIPTION,
  url: PAGE_PATH,
  provider: {
    '@type': 'LocalBusiness',
    name: 'Santi Living',
    url: 'https://karpet.santiliving.com',
    telephone: '+6289519119092',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Godean KM 10, Sleman',
      addressLocality: 'Sleman',
      addressRegion: 'DI Yogyakarta',
      addressCountry: 'ID',
    },
  },
  areaServed: [
    { '@type': 'Place', name: 'Sleman' },
    { '@type': 'Place', name: 'Kota Yogyakarta' },
    { '@type': 'Place', name: 'Bantul' },
    { '@type': 'Place', name: 'Kulon Progo' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Opsi Sewa Karpet Santi Living',
    itemListElement: PRICING_ITEMS.map((item) => ({
      '@type': 'Offer',
      name: item.name,
      description: item.description,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: item.price,
        description: `Mulai ${item.price}${item.unit}`,
      },
    })),
  },
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Beranda',
      item: 'https://karpet.santiliving.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Sewa Karpet Jogja',
      item: PAGE_PATH,
    },
  ],
};

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'sewa karpet jogja',
    'rental karpet jogja',
    'sewa karpet permadani jogja',
    'sewa karpet tahlilan',
    'sewa karpet pengajian',
    'sewa karpet aqiqah',
    'sewa karpet pernikahan jogja',
    'karpet merah jogja',
    'sewa karpet arisan',
    'sewa karpet event jogja',
  ],
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: 'website',
    locale: 'id_ID',
    siteName: 'Santi Living',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SewaKarpetJogjaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <SewaKarpetContent
        faqs={FAQ_ITEMS}
        pricing={PRICING_ITEMS}
        events={EVENT_TYPES}
      />
    </>
  );
}
