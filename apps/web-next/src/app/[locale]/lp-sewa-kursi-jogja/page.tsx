import type { Metadata } from 'next';
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
    robots: {
      index: true,
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
    name: 'Kursi Plastik Sandaran',
    detail: 'Napolly Polimer Tebal',
    price: 'Rp 3.000 – Rp 3.500 / unit / hari',
    description: 'Andalan hajatan warga: ringan, kokoh, mudah disusun rapi.',
  },
  {
    name: 'Kursi Lipat Besi (Chitose)',
    detail: 'Rangka besi lipat praktis',
    price: 'Rp 5.000 / unit / hari',
    description: 'Cocok untuk pengajian, seminar kampus & acara kantor.',
  },
  {
    name: 'Kursi Susun Spons (Futura)',
    detail: 'Dudukan spons empuk',
    price: 'Rp 7.000 / unit / hari',
    description: 'Nyaman untuk akad, resepsi & acara formal berdurasi lama.',
  },
];

const PACKAGES = [
  {
    name: 'Paket Syukuran',
    detail: '50 Kursi',
    description: 'Syukuran rumah, arisan & pengajian rutin.',
  },
  {
    name: 'Paket Hajatan Warga',
    detail: '100 Kursi',
    description: 'Hajatan, tasyakuran & buka bersama skala RT/RW.',
  },
  {
    name: 'Paket Akbar',
    detail: '200+ Kursi',
    description: 'Pernikahan, pengajian akbar & acara kampus/kantor.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Kursinya bersih dan kokoh, datang tepat waktu untuk pengajian rutin kami. Admin fast respon.',
    name: 'Warga pengajian — Sleman',
  },
  {
    quote:
      'Sewa 100 kursi untuk hajatan pernikahan, diantar pickup sampai depan rumah. Rapi dan tidak ada yang rusak.',
    name: 'Keluarga hajatan — Bantul',
  },
  {
    quote:
      'Sudah dua kali pesan untuk acara kampus. Stok banyak, harga jelas, ongkir dapat diskon review.',
    name: 'Panitia acara kampus — Kota Jogja',
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
              Layanan Resmi Sewa Kursi Acara &amp; Hajatan Jogja
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
              Fast Response 07.00 – 21.00 WIB
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-green-950 py-14 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-5 text-3xl font-black leading-tight md:text-5xl">
            Sewa Kursi Plastik Jogja Siap Antar – Bersih, Kokoh &amp; Murah Mulai Rp3.000/Unit
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-slate-200 md:text-lg">
            Solusi praktis perlengkapan duduk untuk hajatan warga, pengajian, syukuran, pernikahan,
            buka bersama, dan acara kampus/kantor di Sleman, Kota Jogja, Bantul, dan Kulon Progo.
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
            Pesan Sekarang (Isi Form)
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-black md:text-3xl">
            Pilihan Jenis Kursi &amp; Estimasi Tarif
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-slate-500">
            Tarif per unit per hari. Total akhir menyesuaikan jumlah, tanggal, dan lokasi antar.
            Isi form untuk rekap harga pasti via WhatsApp.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {CHAIR_TYPES.map((chair) => (
              <div
                key={chair.name}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold">{chair.name}</h3>
                <p className="mb-2 text-xs font-semibold text-slate-500">{chair.detail}</p>
                <p className="mb-2 text-lg font-black text-green-700">{chair.price}</p>
                <p className="text-sm text-slate-600">{chair.description}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-10 text-center text-xl font-black">Paket Hemat Hajatan</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-base font-bold">{pkg.name}</p>
                <p className="mb-2 text-sm font-semibold text-green-300">{pkg.detail}</p>
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
            Dipercaya Warga &amp; Panitia Acara Jogja
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-slate-500">
            Pangkalan armada: Pelemgurih Gamping &amp; Workshop Godean KM 10 — siap antar terjadwal
            ke Sleman, Kota Jogja, Bantul &amp; Kulon Progo.
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
            Form Pemesanan Sewa Kursi
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-sm text-slate-500">
            Isi data di bawah ini — tim kami mencatat permintaan Anda lalu membuka WhatsApp otomatis
            dengan rekap pesanan. Tinggal tekan kirim.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg md:p-8">
            <ChairLeadForm />
          </div>
        </div>
      </section>

      {/* Minimalist footer — no outbound links */}
      <footer className="border-t border-slate-200 bg-slate-950 py-8 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-sm font-semibold text-slate-200">
            © 2026 Santi Living – Layanan Persewaan Kursi Acara &amp; Perlengkapan Hunian
            Yogyakarta. Workshop Jl. Godean KM 10 &amp; Pangkalan Pelemgurih Gamping.
          </p>
        </div>
      </footer>
    </main>
  );
}
