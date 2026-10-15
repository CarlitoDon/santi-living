import type { Metadata } from 'next';
import Image from 'next/image';
import { ChairLeadForm } from '@/components/landing/ChairLeadForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

const PAGE_PATH = '/sewa-kursi-jogja';

const TITLE_ID =
  'Sewa Kursi Jogja — Kursi Plastik, Lipat & Susun Mulai Rp3.000/Unit | Santi Living';
const TITLE_EN =
  'Event Chair Rental Yogyakarta — Plastic, Folding & Banquet Chairs | Santi Living';

const DESCRIPTION_ID =
  'Sewa kursi Jogja murah dan siap antar untuk hajatan, pengajian, rapat & pernikahan di Sleman, Kota Jogja, Bantul, Kulon Progo. Stok ratusan unit siap kirim hari ini.';
const DESCRIPTION_EN =
  'Affordable event chair rental in Yogyakarta for celebrations, gatherings, meetings & weddings in Sleman, Yogyakarta City, Bantul, Kulon Progo. Hundreds of units ready for delivery.';

const KEYWORDS = [
  'sewa kursi jogja',
  'rental kursi jogja',
  'sewa kursi plastik jogja',
  'sewa kursi lipat jogja',
  'sewa kursi hajatan jogja',
  'sewa kursi hotel jogja',
];

const CHAIR_CATALOG = [
  {
    name: 'Kursi Plastik',
    price: 'Mulai Rp3.000/unit',
    numericPrice: 3000,
    tag: 'Paling Laris',
    image: '/images/kursi-plastik-biru.webp',
    description:
      'Plastik polimer tebal berkualitas tinggi, kokoh anti patah, higienis, dan mudah ditata. Solusi paling hemat untuk syukuran, pengajian warga, dan arisan.',
  },
  {
    name: 'Kursi Lipat',
    price: 'Mulai Rp7.000/unit',
    numericPrice: 7000,
    tag: 'Praktis & Rapi',
    image: '/images/kursi-lipat-merah.webp',
    description:
      'Rangka pipa besi kokoh dengan bantalan dudukan & sandaran vinyl rapi. Pilihan tepat untuk rapat dinas, pertemuan kampus, seminar, dan akad nikah.',
  },
  {
    name: 'Kursi Hotel',
    price: 'Mulai Rp10.000/unit',
    numericPrice: 10000,
    tag: 'Elegan & Nyaman',
    image: '/images/kursi-susun-merah.webp',
    description:
      'Dudukan busa empuk tebal dengan rangka chrome/cat elegan. Memberikan kenyamanan maksimal bagi tamu resepsi pernikahan, gala dinner, dan seminar resmi.',
  },
  {
    name: 'Meja Acara / Prasmanan',
    price: 'Mulai Rp25.000/unit',
    numericPrice: 25000,
    tag: 'Perlengkapan Tambahan',
    image: '/images/kursi-acara-jogja-katalog.webp',
    description:
      'Meja panjang serbaguna untuk prasmanan, meja registrasi tamu, meja transit katering, atau meja VIP acara.',
  },
];

const PACKAGES = [
  {
    name: 'Paket 50 Unit',
    price: 'Rp150.000',
    unitCount: '50 Kursi',
    tag: 'Hemat RT/RW',
    description: 'Ideal untuk syukuran rumah, pengajian rutin, rapat panitia, atau arisan keluarga.',
  },
  {
    name: 'Paket 100 Unit',
    price: 'Rp300.000',
    unitCount: '100 Kursi',
    tag: 'Paling Populer',
    popular: true,
    description: 'Solusi andalan untuk hajatan warga, kenduri, tasyakuran pernikahan, atau halal bihalal.',
  },
  {
    name: 'Paket 200 Unit',
    price: 'Rp600.000',
    unitCount: '200 Kursi',
    tag: 'Kapasitas Besar',
    description: 'Kapasitas maksimal untuk resepsi pernikahan warga, pengajian akbar, atau event instansi/kampus.',
  },
];

const FAQS = [
  {
    question: 'Berapa tarif sewa kursi di Jogja via Santi Living?',
    answer:
      'Tarif sewa kursi kami mulai dari Rp3.000/unit untuk Kursi Plastik, Rp7.000/unit untuk Kursi Lipat, Rp10.000/unit untuk Kursi Hotel, dan Rp25.000/unit untuk Meja Acara / Prasmanan.',
  },
  {
    question: 'Berapa minimal unit yang bisa disewa dan bagaimana pengirimannya?',
    answer:
      'Kami melayani pemesanan mulai puluhan unit hingga ratusan unit. Santi Living menyediakan armada pickup khusus yang siap antar-jemput terjadwal langsung ke lokasi acara Anda.',
  },
  {
    question: 'Wilayah mana saja yang dicakup untuk pengiriman kursi?',
    answer:
      'Area pengiriman kami mencakup seluruh Kabupaten Sleman, Kota Yogyakarta, Kabupaten Bantul, dan Kulon Progo. Untuk menjaga ketepatan waktu pengantaran, kami secara tegas tidak melayani pengiriman ke Gunungkidul maupun Solo.',
  },
  {
    question: 'Apakah kondisi kursi bersih, higienis, dan terawat?',
    answer:
      'Pasti. Setiap unit kursi selalu disortir dan dibersihkan sebelum dikirim. Kami memastikan semua kursi dalam kondisi bersih, bebas goyang, dan kokoh untuk kenyamanan tamu Anda.',
  },
  {
    question: 'Bagaimana alur pemesanan sewa kursi Jogja?',
    answer:
      'Cukup isi formulir pemesanan di halaman ini atau hubungi WhatsApp admin Santi Living. Cantumkan perkiraan jumlah kursi, tanggal acara, serta alamat pengiriman untuk mendapatkan estimasi total biaya dan konfirmasi stok.',
  },
];

function buildProductSchema(locale: string) {
  const isEn = locale === 'en';
  const pageUrl = localizedSiteUrl(PAGE_PATH, locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEn ? TITLE_EN : TITLE_ID,
    image: primarySiteUrl('/images/kursi-acara-jogja-pickup.webp'),
    description: isEn ? DESCRIPTION_EN : DESCRIPTION_ID,
    brand: {
      '@type': 'Brand',
      name: 'Santi Living',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: 3000,
      highPrice: 25000,
      offerCount: CHAIR_CATALOG.length,
      offers: CHAIR_CATALOG.map((chair) => ({
        '@type': 'Offer',
        name: chair.name,
        price: chair.numericPrice,
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      })),
    },
  };
}

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_ID;
  const description = isEn ? DESCRIPTION_EN : DESCRIPTION_ID;
  const pageUrl = localizedSiteUrl(PAGE_PATH, isEn ? 'en' : 'id');
  const heroImageUrl = primarySiteUrl('/images/kursi-acara-jogja-pickup.webp');

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title,
    description,
    keywords: KEYWORDS,
    alternates: {
      canonical: pageUrl,
      languages: {
        id: localizedSiteUrl(PAGE_PATH, 'id'),
        en: localizedSiteUrl(PAGE_PATH, 'en'),
        'x-default': localizedSiteUrl(PAGE_PATH, 'id'),
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      locale: isEn ? 'en_US' : 'id_ID',
      siteName: 'Santi Living',
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: 'Sewa Kursi Jogja - Armada Pickup Santi Living',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SewaKursiJogjaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'id';

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-900">
      <JsonLd data={buildProductSchema(currentLocale)} />
      <JsonLd data={buildFaqSchema()} />

      {/* Minimalist isolated header — no outbound links */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3" aria-label="Santi Living">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#315a72] text-base font-black text-white shadow-sm"
            >
              S
            </span>
            <div>
              <span className="block text-lg font-black tracking-tight text-stone-900">
                Santi Living
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Persewaan Kursi DIY
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#315a72]/20 bg-[#315a72]/10 px-3 py-1 text-xs font-bold text-[#315a72]">
              Layanan Resmi Persewaan DIY
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Fast Response 07.00 - 21.00 WIB
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section: Split desktop / stacked mobile */}
      <section className="border-b border-stone-200/70 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
            {/* Left Column (Hero copy & image) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm">
                <span className="text-amber-500">★★★★★ 5.0</span>
                <span className="text-stone-300">•</span>
                <span className="font-semibold text-stone-700">100+ Ulasan Maps</span>
                <span className="text-stone-300">•</span>
                <span className="text-[#315a72]">Siap Antar se-DIY</span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
                Sewa Kursi Jogja
              </h1>

              <p className="mt-2 text-xl font-bold text-[#315a72]">
                Mulai Rp3.000/Unit — Bersih, Kokoh &amp; Siap Kirim Hari Ini
              </p>

              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                Sewa kursi Jogja murah dan siap antar untuk hajatan, pengajian, rapat &amp; pernikahan
                di Sleman, Kota Jogja, Bantul, dan Kulon Progo. Stok ratusan unit siap kirim ke alamat Anda.
              </p>

              {/* Foto hero pickup */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-md">
                <Image
                  src="/images/kursi-acara-jogja-pickup.webp"
                  alt="Armada pickup sewa kursi Jogja Santi Living siap antar langsung ke lokasi"
                  width={640}
                  height={400}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>

              {/* Fitur keunggulan */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-sm">
                  <p className="text-xs font-bold text-stone-900">100% Bersih Higienis</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">Dibersihkan sebelum dikirim</p>
                </div>
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-sm">
                  <p className="text-xs font-bold text-stone-900">Armada Pickup Siap</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">Antar jemput tepat waktu</p>
                </div>
                <div className="col-span-2 rounded-xl border border-stone-200/80 bg-white p-3 shadow-sm sm:col-span-1">
                  <p className="text-xs font-bold text-stone-900">Harga Transparan</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">Tanpa biaya tersembunyi</p>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Capture Form */}
            <div id="form-pemesanan" className="mt-8 scroll-mt-20 lg:col-span-5 lg:mt-0">
              <ChairLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Pilihan Kursi */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              Pilihan Lengkap
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Katalog Pilihan Kursi &amp; Meja Acara
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Pilih jenis kursi sesuai kebutuhan konsep acara Anda. Semua unit terawat dan siap pakai.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHAIR_CATALOG.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="relative mb-4 aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-xl bg-stone-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="rounded-xl object-contain p-2"
                    />
                  </div>
                  <span className="inline-block rounded-md bg-[#315a72]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#315a72]">
                    {item.tag}
                  </span>
                  <h3 className="mt-2.5 text-base font-bold text-stone-900">{item.name}</h3>
                  <p className="mt-1.5 text-lg font-black text-[#D95D24]">{item.price}</p>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">{item.description}</p>
                </div>
                <div className="pt-5">
                  <a
                    href="#form-pemesanan"
                    className="block w-full rounded-xl bg-[#315a72] py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#28495c]"
                  >
                    Pilih &amp; Sewa
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paket Hajatan Warga */}
      <section className="border-t border-stone-200/80 bg-stone-50/60 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D95D24]/10 px-3 py-1 text-xs font-bold text-[#D95D24]">
              Paket Hemat Komunitas &amp; Warga
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Paket Hajatan Warga
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Paket hemat sewa kursi untuk acara skala RT, RW, dusun, dan keluarga besar di Jogja.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                  pkg.popular
                    ? 'border-[#315a72] ring-2 ring-[#315a72]/15'
                    : 'border-stone-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#315a72]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#315a72]">
                      {pkg.tag}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">{pkg.unitCount}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-stone-900">{pkg.name}</h3>
                  <p className="mt-2 text-2xl font-black text-[#D95D24]">{pkg.price}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{pkg.description}</p>
                </div>
                <div className="pt-6">
                  <a
                    href="#form-pemesanan"
                    className={`block w-full rounded-xl py-2.5 text-center text-xs font-bold transition shadow-sm ${
                      pkg.popular
                        ? 'bg-[#315a72] text-white hover:bg-[#28495c]'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    Pesan {pkg.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zona Pengiriman */}
      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              Cakupan Wilayah
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Zona Pengiriman Kursi Jogja
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Armada pickup Santi Living siap antar jemput terjadwal di wilayah operasional resmi kami.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center">
              <span className="text-emerald-700 font-black text-lg">✓ Sleman</span>
              <p className="mt-1 text-xs text-stone-600">Depok, Mlati, Godean, Ngaglik &amp; sekitarnya</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center">
              <span className="text-emerald-700 font-black text-lg">✓ Kota Jogja</span>
              <p className="mt-1 text-xs text-stone-600">Gondokusuman, Umbulharjo, Kraton &amp; seluruh kota</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center">
              <span className="text-emerald-700 font-black text-lg">✓ Bantul</span>
              <p className="mt-1 text-xs text-stone-600">Kasihan, Sewon, Banguntapan, Bantul Kota</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center">
              <span className="text-emerald-700 font-black text-lg">✓ Kulon Progo</span>
              <p className="mt-1 text-xs text-stone-600">Wates, Sentolo, Pengasih &amp; sekitarnya</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-center">
            <p className="text-xs font-bold text-amber-900">
              Perhatian Batas Layanan:
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-800">
              Untuk menjaga komitmen waktu dan efisiensi armada antar-jemput, kami{' '}
              <strong className="font-bold underline">tidak melayani pengiriman ke wilayah Gunungkidul maupun Solo</strong>.
              Layanan kami fokus 100% pada Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-stone-200/80 bg-[#FDFBF7] py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              Tanya Jawab
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Pertanyaan Seputar Sewa Kursi Jogja
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-stone-900 sm:text-base">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition group-open:rotate-180">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-stone-300 bg-slate-950 py-10 text-center text-slate-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#315a72] text-xs font-black text-white">
                S
              </span>
              <span className="text-base font-black text-white">Santi Living</span>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-slate-400">
              Layanan Resmi Persewaan Kursi Acara &amp; Perlengkapan Acara Yogyakarta.
              Workshop Jl. Godean KM 10 &amp; Pangkalan Pelemgurih Gamping.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              &copy; 2026 Santi Living. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}