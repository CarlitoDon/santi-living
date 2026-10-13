import type { Metadata } from 'next';
import { MattressLeadForm } from '@/components/landing/MattressLeadForm';
import { localizedSiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

const PAGE_PATH = '/lp-sewa-kasur-jogja';

const PAGE_TITLE = 'Sewa Kasur Busa Jogja Siap Antar Hari Ini | Tebal 20 cm Mulai 30rb';

const PAGE_DESCRIPTION =
  'Sewa kasur busa Jogja siap antar hari ini: tebal 20 cm, steril UV-C & wangi laundry mulai Rp30.000/hari untuk tamu, keluarga, homestay, kos & acara di Sleman, Kota Jogja, Bantul, Kulon Progo. Isi form, dapat rekap via WhatsApp.';

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
    title: 'Steril UV-C & Wangi Laundry',
    description: 'Dibersihkan sinar UV-C dan dilengkapi set sprei fresh wangi laundry hotel.',
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
  },
  {
    name: 'Kasur Double (120x200)',
    dimension: 'Tebal 20 cm • Luas Nyaman 1–2 Orang',
    priceOnly: 'Rp 40.000 / hari',
    priceComplete: 'Rp 50.000 / hari',
    description: 'Ukuran semi ganda ideal untuk saudara, tamu keluarga, atau anak-anak saat liburan.',
  },
  {
    name: 'Kasur Queen (160x200)',
    dimension: 'Tebal 20 cm • Nyaman 2 Orang Dewasa',
    priceOnly: 'Rp 50.000 / hari',
    priceComplete: 'Rp 60.000 / hari',
    description: 'Solusi homestay, villa, atau keluarga yang membutuhkan ruang tidur lebih leluasa.',
  },
  {
    name: 'Kasur King (180x200)',
    dimension: 'Tebal 20 cm • Maksimal 2–3 Orang / Keluarga',
    priceOnly: 'Rp 60.000 / hari',
    priceComplete: 'Rp 70.000 / hari',
    description: 'Kasur ukuran master bed untuk kenyamanan maksimal seluruh anggota keluarga.',
  },
];

const SPECIAL_PACKAGES = [
  {
    name: 'Paket Lengkap Harian',
    highlight: 'Kasur + Sprei + Bantal + Selimut',
    description: 'Tinggal pakai tanpa repot bawa perlengkapan tidur dari rumah.',
  },
  {
    name: 'Paket Homestay & Event',
    highlight: 'Sewa 3+ Unit Diskon 10–15%',
    description: 'Siap dukung lonjakan tamu rombongan, liburan keluarga & event rombongan.',
  },
  {
    name: 'Paket Bulanan Kost',
    highlight: 'Mulai Rp 900.000 / bulan',
    description: 'Solusi hemat untuk mahasiswa atau pekerja magang tanpa perlu beli kasur baru.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Keluarga mendadak datang liburan ke Jogja, langsung sewa 2 paket lengkap single. Kasur tebal 20 cm empuk, sprei wangi hotel, pengantaran kilat.',
    name: 'Ibu Ratna — Tamu Keluarga, Sleman',
  },
  {
    quote:
      'Homestay kami kekurangan kasur pas libur panjang. Pesan pagi jam 9, jam 12 sudah sampai di villa. Tamu puas banget, admin responsif!',
    name: 'Pak Hendra — Pengelola Homestay, Kota Jogja',
  },
  {
    quote:
      'Baru pindah kosan perabot belum datang. Sewa kasur 1 minggu di Santi Living sangat ngebantu, bersih, steril, dan gak ribet.',
    name: 'Dimas — Mahasiswa Kos, Depok Sleman',
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
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceSchema(currentLocale)) }}
      />

      {/* Minimalist header — no outbound links */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3" aria-label="Santi Living">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-lg font-black text-white"
            >
              S
            </span>
            <span className="text-xl font-black tracking-tight">Santi Living</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800">
              Layanan Resmi Sewa Kasur Busa Jogja
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
              Siap Antar Hari Ini (07.00 – 21.00 WIB)
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-green-950 py-14 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-5 text-3xl font-black leading-tight md:text-5xl">
            Sewa Kasur Busa Jogja Siap Antar Hari Ini – Tebal 20 cm, Steril UV-C &amp; Wangi Laundry Mulai Rp30.000/Hari
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-slate-200 md:text-lg">
            Solusi tidur nyaman tanpa repot untuk tamu mendadak, liburan keluarga, homestay, kos
            sementara, dan acara rombongan di Sleman, Kota Jogja, Bantul, dan Kulon Progo.
          </p>
          <div className="mb-10 grid gap-3 text-left sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="mb-1 font-bold text-green-300">{benefit.title}</p>
                <p className="text-sm text-slate-200">{benefit.description}</p>
              </div>
            ))}
          </div>
          <a
            href="#form-pemesanan"
            className="inline-block rounded-xl bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-green-600"
          >
            Pesan Kasur Sekarang (Isi Form)
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-black md:text-3xl">
            Pilihan Ukuran Kasur &amp; Tarif Transparan
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-slate-500">
            Tarif harian jujur tanpa biaya tersembunyi. Tersedia kasur busa saja atau paket lengkap
            (kasur + sprei wangi + bantal + selimut).
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {MATTRESS_SIZES.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="mb-3 text-xs font-semibold text-slate-500">{item.dimension}</p>
                  <div className="mb-3 rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center justify-between py-1 text-sm">
                      <span className="text-slate-600">Kasur Saja:</span>
                      <span className="font-bold text-slate-900">{item.priceOnly}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 py-1 text-sm">
                      <span className="font-semibold text-green-700">Paket Lengkap:</span>
                      <span className="font-black text-green-700">{item.priceComplete}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <div className="pt-4">
                  <a
                    href="#form-pemesanan"
                    className="block rounded-lg bg-green-50 py-2 text-center text-sm font-bold text-green-800 transition hover:bg-green-100"
                  >
                    Pilih Ukuran Ini
                  </a>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-12 text-center text-xl font-black">Paket Spesial &amp; Sewa Durasi</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {SPECIAL_PACKAGES.map((pkg) => (
              <div key={pkg.name} className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-base font-bold">{pkg.name}</p>
                <p className="mb-2 text-sm font-semibold text-green-300">{pkg.highlight}</p>
                <p className="text-sm text-slate-300">{pkg.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-black md:text-3xl">
            Dipercaya Tamu, Keluarga &amp; Penginapan di Jogja
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-slate-500">
            Pangkalan armada: Pelemgurih Gamping &amp; Workshop Godean KM 10 — siap antar terjadwal
            langsung sampai ke kamar tidur Anda di Sleman, Kota Jogja, Bantul &amp; Kulon Progo.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure key={item.name} className="rounded-xl border border-slate-200 bg-white p-5">
                <p aria-label="Rating bintang 5" className="mb-2 text-amber-500">
                  ★★★★★
                </p>
                <blockquote className="mb-3 text-sm text-slate-700">“{item.quote}”</blockquote>
                <figcaption className="text-xs font-bold text-slate-500">{item.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="form-pemesanan" className="scroll-mt-6 py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-2 text-center text-2xl font-black md:text-3xl">
            Form Pemesanan Sewa Kasur Jogja
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-sm text-slate-500">
            Isi data pemesanan di bawah ini — tim kami mencatat kebutuhan Anda lalu membuka WhatsApp otomatis
            dengan rincian pesanan. Siap antar langsung hari ini!
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg md:p-8">
            <MattressLeadForm />
          </div>
        </div>
      </section>

      {/* Minimalist footer — no outbound links */}
      <footer className="border-t border-slate-200 bg-slate-950 py-8 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-sm font-semibold text-slate-200">
            © 2026 Santi Living – Layanan Persewaan Kasur Busa, Kasur Ekstra &amp; Perlengkapan Tidur
            Yogyakarta. Workshop Jl. Godean KM 10 &amp; Pangkalan Pelemgurih Gamping.
          </p>
        </div>
      </footer>
    </main>
  );
}
