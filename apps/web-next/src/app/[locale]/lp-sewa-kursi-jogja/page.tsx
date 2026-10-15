import type { Metadata } from 'next';
import Image from 'next/image';
import { ChairLeadForm } from '@/components/landing/ChairLeadForm';
import { localizedSiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

const PAGE_PATH = '/lp-sewa-kursi-jogja';

const PAGE_TITLE = 'Sewa Kursi Plastik Jogja Murah Siap Antar | Mulai 3rb/Unit';

const PAGE_DESCRIPTION =
  'Sewa kursi plastik Jogja siap antar: bersih, kokoh & murah mulai Rp3.000/unit/hari untuk hajatan, pengajian, syukuran & pernikahan di Sleman, Kota Jogja, Bantul, Kulon Progo. Isi form, dapat rekap harga via WhatsApp.';

function buildServiceSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sewa Kursi Plastik Jogja',
    serviceType: 'Chair Rental',
    description: PAGE_DESCRIPTION,
    url: localizedSiteUrl(PAGE_PATH, locale),
    provider: {
      '@type': 'LocalBusiness',
      name: 'Santi Living',
      telephone: '+62-895-1911-9092',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Godean KM 10 & Pelemgurih Gamping',
        addressLocality: 'Sleman',
        addressRegion: 'Yogyakarta',
        addressCountry: 'ID',
      },
    },
    areaServed: ['Sleman', 'Kota Yogyakarta', 'Bantul', 'Kulon Progo'],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'id';
  const pageUrl = localizedSiteUrl(PAGE_PATH, currentLocale);

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    keywords: [
      'sewa kursi plastik jogja',
      'sewa kursi jogja',
      'sewa kursi hajatan jogja',
      'sewa kursi acara jogja',
      'rental kursi plastik jogja',
      'sewa kursi lipat jogja',
    ],
    alternates: {
      canonical: pageUrl,
      languages: {
        id: localizedSiteUrl(PAGE_PATH, 'id'),
        en: localizedSiteUrl(PAGE_PATH, 'en'),
        'x-default': localizedSiteUrl(PAGE_PATH, 'id'),
      },
    },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: pageUrl,
      type: 'website',
      locale: currentLocale === 'en' ? 'en_US' : 'id_ID',
      siteName: 'Santi Living',
    },
    twitter: {
      card: 'summary_large_image',
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
    },
    // LP iklan: noindex agar tidak bersaing dengan money page organik /sewa-kursi-acara
    robots: {
      index: false,
      follow: true,
    },
  };
}

const BENEFITS = [
  {
    title: 'Busa/Polimer Tebal & Kokoh',
    description: 'Mampu menahan beban 100+ kg, tidak goyang saat dipakai acara lama.',
  },
  {
    title: '100% Bersih & Higienis',
    description: 'Dibersihkan & dicek satu per satu sebelum dikirim ke lokasi Anda.',
  },
  {
    title: 'Armada Pickup Siap Antar Cepat',
    description: 'Antar jemput terjadwal langsung ke lokasi acara di seluruh Jogja.',
  },
  {
    title: 'Diskon Ongkir s/d 70%',
    description: 'Khusus pelanggan yang memberi ulasan bintang 5 di Google Maps.',
  },
];

const CHAIR_TYPES = [
  {
    name: 'Kursi Plastik',
    detail: 'Polimer Tebal',
    price: 'Rp 3.000 - Rp 3.500 / unit / hari',
    description: 'Andalan hajatan warga: ringan, kokoh, mudah disusun rapi.',
    popular: true,
    image: '/images/kursi-plastik-biru.webp',
  },
  {
    name: 'Kursi Lipat',
    detail: 'Rangka besi lipat praktis',
    price: 'Rp 5.000 / unit / hari',
    description: 'Cocok untuk pengajian, seminar kampus & acara kantor.',
    popular: false,
    image: '/images/kursi-lipat-merah.webp',
  },
  {
    name: 'Kursi Hotel',
    detail: 'Dudukan spons empuk',
    price: 'Rp 7.000 / unit / hari',
    description: 'Nyaman untuk akad, resepsi & acara formal berdurasi lama.',
    popular: false,
    image: '/images/kursi-susun-merah.webp',
  },
];

const PACKAGES = [
  {
    name: 'Paket Syukuran',
    detail: '50 Kursi',
    tag: 'Hemat RT/RW',
    description: 'Syukuran rumah, arisan & pengajian rutin.',
  },
  {
    name: 'Paket Hajatan Warga',
    detail: '100 Kursi',
    tag: 'Paling Laris',
    description: 'Hajatan, tasyakuran & buka bersama skala RT/RW.',
  },
  {
    name: 'Paket Akbar',
    detail: '200+ Kursi',
    tag: 'Acara Besar',
    description: 'Pernikahan, pengajian akbar & acara kampus/kantor.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Kursinya bersih dan kokoh, datang tepat waktu untuk pengajian rutin kami. Admin fast respon.',
    name: 'Warga Pengajian (Sleman)',
  },
  {
    quote:
      'Sewa 100 kursi untuk hajatan pernikahan, diantar pickup sampai depan rumah. Rapi dan tidak ada yang rusak.',
    name: 'Keluarga Hajatan (Bantul)',
  },
  {
    quote:
      'Sudah dua kali pesan untuk acara kampus. Stok banyak, harga jelas, ongkir dapat diskon review.',
    name: 'Panitia Acara Kampus (Kota Jogja)',
  },
];

export default async function LpSewaKursiJogjaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale === 'en' ? 'en' : 'id';

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceSchema(currentLocale)) }}
      />

      {/* Minimalist header — no outbound links */}
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
              <span className="block text-lg font-black tracking-tight text-stone-900">Santi Living</span>
              <span className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Persewaan DIY</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#315a72]/10 border border-[#315a72]/20 px-3 py-1 text-xs font-bold text-[#315a72]">
              Layanan Resmi Persewaan DIY
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Fast Response 07.00 - 21.00 WIB
            </span>
          </div>
        </div>
      </header>

      {/* Hero: Asymmetric 2-column layout */}
      <section className="border-b border-stone-200/70 py-10 sm:py-14 lg:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            {/* Left Column (col-span-7) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#315a72]/20 bg-[#315a72]/10 px-3.5 py-1 text-xs font-bold tracking-wide text-[#315a72]">
                <span>⭐</span> Rental Kursi Acara Jogja
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
                Sewa Kursi Acara Jogja
              </h1>
              <p className="mt-2 text-lg font-bold text-[#315a72]">
                Bersih, kokoh &amp; siap antar langsung ke lokasi. Mulai Rp3.000/unit.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
                Stok ratusan unit siap antar untuk hajatan, pengajian &amp; acara di seluruh DIY.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 shadow-sm text-xs">
                <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
                <span className="text-stone-300">•</span>
                <span className="font-semibold text-stone-600">100+ Ulasan Maps</span>
                <span className="text-stone-300">•</span>
                <span className="rounded bg-[#D95D24]/10 px-1.5 py-0.5 font-bold text-[#D95D24]">Diskon Ongkir s/d 70%</span>
              </div>

              {/* Foto Armada Pickup Asli Santi Living */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 shadow-md">
                <Image
                  src="/images/kursi-acara-jogja-pickup.webp"
                  alt="Armada pickup pengantaran kursi acara Santi Living Jogja"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Benefit points: visible on lg */}
              <div className="hidden lg:grid mt-6 grid gap-3 sm:grid-cols-2">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-white p-3.5 shadow-sm"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#315a72]/10 text-[#315a72]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">{benefit.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (col-span-5): Form Pemesanan directly in hero */}
            <div id="form-pemesanan" className="mt-6 scroll-mt-20 lg:col-span-5 lg:mt-0">
              <ChairLeadForm />
            </div>
          </div>

          {/* Benefit points: visible on mobile below form */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-white p-3.5 shadow-sm"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#315a72]/10 text-[#315a72]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{benefit.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Katalog & Paket */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              Katalog Transparan
            </div>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Pilihan Jenis Kursi &amp; Estimasi Tarif
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Tarif per unit per hari. Total akhir menyesuaikan jumlah, tanggal, dan lokasi antar.
              Isi formulir untuk rekap harga instan via WhatsApp.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CHAIR_TYPES.map((chair) => (
              <div
                key={chair.name}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                  chair.popular
                    ? 'border-[#315a72] ring-2 ring-[#315a72]/15'
                    : 'border-stone-200/90'
                }`}
              >
                {chair.popular ? (
                  <span className="absolute -top-3 right-6 rounded-full bg-[#D95D24] px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                    Paling Diminati
                  </span>
                ) : null}
                <div>
                  <div className="relative mb-4 aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-xl bg-stone-50">
                    <Image
                      src={chair.image}
                      alt={chair.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain rounded-xl p-2"
                    />
                  </div>
                  <span className="inline-block rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                    {chair.detail}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-stone-900">{chair.name}</h3>
                  <p className="mt-2 text-2xl font-black text-[#315a72]">{chair.price}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{chair.description}</p>
                </div>
                <div className="pt-6">
                  <a
                    href="#form-pemesanan"
                    className={`block w-full rounded-xl py-2.5 text-center text-sm font-bold transition ${
                      chair.popular
                        ? 'bg-[#315a72] text-white hover:bg-[#28495c] shadow-sm'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    Pilih Kursi Ini
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Paket Hemat Hajatan */}
          <div className="mt-14">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-xl font-black text-stone-900 sm:text-2xl">Paket Hemat Hajatan Warga</h3>
              <p className="mt-1 text-sm text-stone-600">Solusi paket praktis dengan armada antar jemput langsung ke depan rumah</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#D95D24]/10 border border-[#D95D24]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#D95D24]">
                        {pkg.tag}
                      </span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">Armada Ready</span>
                    </div>
                    <p className="mt-4 text-lg font-bold text-stone-900">{pkg.name}</p>
                    <p className="mt-1 text-xl font-black text-[#315a72]">{pkg.detail}</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{pkg.description}</p>
                  </div>
                  <div className="pt-5">
                    <a
                      href="#form-pemesanan"
                      className="block w-full rounded-xl bg-[#315a72] py-2.5 text-center text-xs font-bold text-white transition hover:bg-[#28495c] shadow-sm"
                    >
                      Pesan Paket Ini
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Armada & Workshop */}
      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              Armada &amp; Workshop Santi Living
            </div>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Pangkalan Pelemgurih Gamping &amp; Workshop Godean KM 10
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Kapasitas armada siap antar terjadwal ke Sleman, Kota Jogja, Bantul, dan Kulon Progo.
            </p>
          </div>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
            <Image
              src="/images/kursi-acara-jogja-katalog.webp"
              alt="Stok kursi acara Santi Living Jogja di workshop"
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
            />
            <figcaption className="bg-stone-50 p-4 text-center">
              <p className="text-sm font-semibold text-stone-700">
                Stok puluhan hingga ratusan kursi steril siap antar dari workshop Godean KM 10 &amp; Pelemgurih Gamping.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Social proof / Testimoni */}
      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              Testimoni Asli Warga Jogja
            </div>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Dipercaya Warga &amp; Panitia Acara Jogja
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Pangkalan armada: Pelemgurih Gamping &amp; Workshop Godean KM 10 - siap antar terjadwal
              ke Sleman, Kota Jogja, Bantul &amp; Kulon Progo.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-[#FDFBF7] p-6 shadow-sm"
              >
                <div>
                  <div aria-label="Rating bintang 5" className="flex items-center gap-1 text-amber-500">
                    <span>★★★★★</span>
                    <span className="text-[11px] font-bold text-stone-500 ml-1">Verified Customer</span>
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-stone-700">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-4 border-t border-stone-200/60 pt-3 text-xs font-bold text-stone-800">
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist footer — no outbound links */}
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
              Layanan Resmi Persewaan Kursi Acara &amp; Perlengkapan Hunian Yogyakarta.
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
