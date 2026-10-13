import type { Metadata } from 'next';
import Image from 'next/image';
import { MattressLeadForm } from '@/components/landing/MattressLeadForm';
import { localizedSiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

const PAGE_PATH = '/lp-sewa-kasur-jogja';

const PAGE_TITLE = 'Sewa Kasur Busa Jogja Siap Antar Hari Ini | Tebal 20 cm Mulai 30rb';

const PAGE_DESCRIPTION =
  'Sewa kasur busa Jogja siap antar hari ini: tebal 20 cm, bersih higienis & wangi laundry mulai Rp30.000/hari untuk tamu, keluarga, homestay, kos & acara di Sleman, Kota Jogja, Bantul, Kulon Progo. Isi form, dapat rekap via WhatsApp.';

function buildServiceSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sewa Kasur Busa Jogja',
    serviceType: 'Mattress Rental',
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
      'sewa kasur jogja',
      'sewa kasur busa jogja',
      'rental kasur jogja',
      'sewa kasur sleman',
      'sewa kasur homestay jogja',
      'sewa kasur murah jogja',
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

const BENEFITS = [
  {
    title: 'Busa Tebal 20 cm & Empuk',
    description: 'Busa density tinggi (Royal/Inoac), tidak mudah gembos dan nyaman untuk istirahat optimal.',
  },
  {
    title: 'Bersih Higienis & Wangi Laundry',
    description: 'Dibersihkan menyeluruh dan dilengkapi set sprei fresh wangi laundry hotel.',
  },
  {
    title: 'Siap Antar Hari Ini',
    description: 'Armada pickup siap kirim langsung ke kos, rumah, homestay, atau hotel di seluruh Jogja.',
  },
  {
    title: 'Diskon Ongkir s/d 70%',
    description: 'Khusus pelanggan yang memberikan review bintang 5 di Google Maps Santi Living.',
  },
];

const MATTRESS_SIZES = [
  {
    name: 'Kasur Single (90x200 / 100x200)',
    dimension: 'Tebal 20 cm • Cocok 1 Orang / Ekstra Bed',
    priceOnly: 'Rp 30.000 / hari',
    priceComplete: 'Rp 40.000 / hari',
    description: 'Pilihan paling populer untuk ekstra bed tamu, mahasiswa baru, atau kos sementara.',
    popular: true,
    image: '/images/paket-90.webp',
  },
  {
    name: 'Kasur Double (120x200)',
    dimension: 'Tebal 20 cm • Luas Nyaman 1-2 Orang',
    priceOnly: 'Rp 40.000 / hari',
    priceComplete: 'Rp 50.000 / hari',
    description: 'Ukuran semi ganda ideal untuk saudara, tamu keluarga, atau anak-anak saat liburan.',
    popular: false,
    image: '/images/paket-120.webp',
  },
  {
    name: 'Kasur Queen (160x200)',
    dimension: 'Tebal 20 cm • Nyaman 2 Orang Dewasa',
    priceOnly: 'Rp 50.000 / hari',
    priceComplete: 'Rp 60.000 / hari',
    description: 'Solusi homestay, villa, atau keluarga yang membutuhkan ruang tidur lebih leluasa.',
    popular: false,
    image: '/images/paket-160.webp',
  },
  {
    name: 'Kasur King (180x200)',
    dimension: 'Tebal 20 cm • Maksimal 2-3 Orang / Keluarga',
    priceOnly: 'Rp 60.000 / hari',
    priceComplete: 'Rp 70.000 / hari',
    description: 'Kasur ukuran master bed untuk kenyamanan maksimal seluruh anggota keluarga.',
    popular: false,
    image: '/images/paket-180.webp',
  },
];

const SPECIAL_PACKAGES = [
  {
    name: 'Paket Lengkap Harian',
    tag: 'Siap Tidur Nyenyak',
    highlight: 'Kasur + Sprei + Bantal + Selimut',
    description: 'Tinggal pakai tanpa repot bawa perlengkapan tidur dari rumah.',
  },
  {
    name: 'Paket Homestay & Event',
    tag: 'Diskon Volume',
    highlight: 'Sewa 3+ Unit Diskon 10-15%',
    description: 'Siap dukung lonjakan tamu rombongan, liburan keluarga & event rombongan.',
  },
  {
    name: 'Paket Bulanan Kost',
    tag: 'Hemat Bulanan',
    highlight: 'Mulai Rp 900.000 / bulan',
    description: 'Solusi hemat untuk mahasiswa atau pekerja magang tanpa perlu beli kasur baru.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Keluarga mendadak datang liburan ke Jogja, langsung sewa 2 paket lengkap single. Kasur tebal 20 cm empuk, sprei wangi hotel, pengantaran kilat.',
    name: 'Ibu Ratna (Tamu Keluarga, Sleman)',
  },
  {
    quote:
      'Homestay kami kekurangan kasur pas libur panjang di Malioboro. Pesan pagi jam 9, jam 12 sudah sampai di homestay. Tamu puas banget, admin responsif!',
    name: 'Pak Hendra (Pengelola Homestay, Malioboro Kota Jogja)',
  },
  {
    quote:
      'Baru pindah kosan perabot belum datang. Sewa kasur 1 minggu di Santi Living sangat ngebantu, bersih, steril, dan gak ribet.',
    name: 'Dimas (Mahasiswa Kos, Depok Sleman)',
  },
];

export default async function LpSewaKasurJogjaPage({
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
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Persewaan DIY</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#315a72]/10 border border-[#315a72]/20 px-3 py-1 text-xs font-bold text-[#315a72]">
              Layanan Resmi Persewaan DIY
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Siap Antar Hari Ini (07.00 - 21.00 WIB)
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
                <span>⭐</span> Persewaan Kasur Busa &amp; Extra Bed Yogyakarta
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl md:text-5xl md:leading-[1.15]">
                Sewa Kasur Busa Jogja Siap Antar Hari Ini - Tebal 20 cm, Bersih Higienis &amp; Wangi Laundry Mulai Rp30.000/Hari
              </h1>

              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                Solusi tidur nyaman tanpa repot untuk tamu mendadak, liburan keluarga, homestay, kos
                sementara, dan acara rombongan di Sleman, Kota Jogja, Bantul, dan Kulon Progo.
                Armada pickup siap kirim langsung sampai ke kamar tidur Anda.
              </p>

              {/* Rating badge 5.0 Google Maps */}
              <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <span aria-hidden="true">★★★★★</span>
                  <span className="ml-1 text-xs font-black text-stone-800">5.0 / 5.0</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-semibold text-stone-600">100+ Ulasan Google Maps</span>
                <span className="text-stone-300">•</span>
                <span className="rounded-md bg-[#D95D24]/10 px-2 py-0.5 text-xs font-bold text-[#D95D24]">
                  Diskon Ongkir s/d 70%
                </span>
              </div>

              {/* Foto Kamar Tidur Siap Pakai */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
                <Image
                  src="/images/hero-kasur-lantai-mocha.webp"
                  alt="Kasur busa lantai steril tebal 20 cm sprei cokelat mocha tanpa dipan siap pakai Santi Living Jogja"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Benefit points with clean SVG checklist */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
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

              {/* Mobile quick scroll button */}
              <a
                href="#form-pemesanan"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#315a72] px-6 py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-[#28495c] lg:hidden"
              >
                Langsung Isi Form Pemesanan ↓
              </a>
            </div>

            {/* Right Column (col-span-5): Form Pemesanan directly in hero */}
            <div id="form-pemesanan" className="mt-8 scroll-mt-20 lg:col-span-5 lg:mt-0">
              <MattressLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Section Katalog & Paket */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              Tarif Transparan &amp; Jujur
            </div>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Pilihan Ukuran Kasur Busa
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Tarif harian jujur tanpa biaya tersembunyi. Tersedia kasur busa saja atau paket lengkap
              (kasur + sprei wangi hotel + bantal + selimut).
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {MATTRESS_SIZES.map((item) => (
              <div
                key={item.name}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                  item.popular
                    ? 'border-[#315a72] ring-2 ring-[#315a72]/15'
                    : 'border-stone-200/90'
                }`}
              >
                {item.popular ? (
                  <span className="absolute -top-3 right-6 rounded-full bg-[#D95D24] px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                    Paling Diminati
                  </span>
                ) : null}
                <div>
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="inline-block rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                    {item.dimension}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-stone-900">{item.name}</h3>

                  <div className="mt-4 rounded-xl border border-stone-200/80 bg-stone-50/80 p-4">
                    <div className="flex items-center justify-between py-1 text-sm">
                      <span className="text-stone-600">Kasur Saja:</span>
                      <span className="font-extrabold text-stone-900">{item.priceOnly}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-200/80 pt-2 text-sm">
                      <span className="font-bold text-[#315a72]">Paket Lengkap (Bedding):</span>
                      <span className="text-lg font-black text-[#315a72]">{item.priceComplete}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-stone-600">{item.description}</p>
                </div>
                <div className="pt-6">
                  <a
                    href="#form-pemesanan"
                    className={`block w-full rounded-xl py-3 text-center text-sm font-bold transition ${
                      item.popular
                        ? 'bg-[#315a72] text-white hover:bg-[#28495c] shadow-sm'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    Pilih Ukuran Ini
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Paket Spesial & Sewa Durasi */}
          <div className="mt-14">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-xl font-black text-stone-900 sm:text-2xl">Paket Spesial &amp; Sewa Durasi</h3>
              <p className="mt-1 text-sm text-stone-600">Diskon khusus untuk pemesanan rombongan &amp; masa sewa fleksibel</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {SPECIAL_PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#D95D24] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        {pkg.tag}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Siap Kirim</span>
                    </div>
                    <p className="mt-4 text-lg font-black text-white">{pkg.name}</p>
                    <p className="mt-1 text-xl font-black text-emerald-300">{pkg.highlight}</p>
                    <p className="mt-3 text-sm text-slate-300">{pkg.description}</p>
                  </div>
                  <div className="pt-5">
                    <a
                      href="#form-pemesanan"
                      className="block w-full rounded-xl bg-white/10 py-2.5 text-center text-xs font-bold text-white transition hover:bg-white/20"
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

      {/* Section Jaminan Higienis & Armada */}
      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              Jaminan Higienis &amp; Armada Cepat
            </div>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Bersih Higienis &amp; Siap Kirim ke Depan Kamar Anda
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Setiap kasur dibersihkan dengan standar higienis tinggi dan diantar armada pickup terlindung langsung dari pangkalan Pelemgurih Gamping &amp; Workshop Godean KM 10.
            </p>
          </div>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
            <Image
              src="/images/hero-pengiriman-santi-living.webp"
              alt="Pengantaran kasur busa Santi Living Jogja"
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Social proof / Testimoni */}
      <section className="border-t border-stone-200/80 bg-stone-50 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              Ulasan Pelanggan Jogja
            </div>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
              Dipercaya Tamu, Keluarga &amp; Penginapan di Jogja
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Pangkalan armada: Pelemgurih Gamping &amp; Workshop Godean KM 10 - siap antar terjadwal
              langsung sampai ke kamar tidur Anda di Sleman, Kota Jogja, Bantul &amp; Kulon Progo.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm"
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
              Layanan Persewaan Kasur Busa, Kasur Ekstra &amp; Perlengkapan Tidur Yogyakarta.
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
