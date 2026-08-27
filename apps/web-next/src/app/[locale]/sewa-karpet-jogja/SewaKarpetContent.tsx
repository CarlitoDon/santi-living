'use client';

import { FAQAccordion } from '@/components/ui/FAQAccordion';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface PricingItem {
  name: string;
  price: string;
  unit: string;
  description: string;
}

interface EventItem {
  name: string;
  description: string;
}

interface SewaKarpetContentProps {
  faqs: FAQItem[];
  pricing: PricingItem[];
  events: EventItem[];
}

const WA_NUMBER = '6289519119092';
const WA_DISPLAY = '0895-1911-9092';
const WA_INQUIRY_TEXT =
  'Halo Santi Living, saya ingin tanya sewa karpet Jogja.\n\nJenis acara: \nTanggal acara: \nLokasi acara: \nUkuran area: \nJenis karpet yang dibutuhkan: \n\nMohon info ketersediaan dan estimasi harga.';

function getWhatsAppUrl(): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_INQUIRY_TEXT)}`;
}

export function SewaKarpetContent({
  faqs,
  pricing,
  events,
}: SewaKarpetContentProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
            Sewa Karpet &amp; Permadani Jogja{' '}
            <span className="block text-blue-300">
              Acara, Tahlilan, Aqiqah &amp; Pernikahan
            </span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-slate-200 md:text-xl">
            Santi Living menyediakan layanan sewa karpet Jogja mulai dari
            Rp25.000/hari. Melayani wilayah Sleman, Kota Jogja, Bantul, dan
            Kulon Progo untuk berbagai jenis acara.
          </p>
          <p className="mx-auto mb-8 max-w-xl text-sm text-slate-300">
            Karpet polos, permadani motif, hingga karpet merah VIP. Anta
            jemput, free konsultasi via WhatsApp.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-green-600"
            >
              <span>Harga &amp; Konsultasi</span>
              <span className="text-sm opacity-90">{WA_DISPLAY}</span>
            </a>
            <a
              href="#harga-sewa-karpet"
              className="inline-flex items-center rounded-lg border border-slate-400 px-8 py-3 text-base font-semibold text-slate-200 transition-colors hover:border-white hover:text-white"
            >
              Lihat Harga
            </a>
          </div>
        </div>
      </section>

      {/* Quick Answer / TL;DR */}
      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-center text-lg font-medium text-slate-700">
            Sewa karpet Jogja di Santi Living mulai Rp25.000/hari. Tersedia
            karpet polos, permadani motif, dan karpet merah VIP untuk tahlilan,
            aqiqah, pengajian, pernikahan, arisan, dan event komunitas di
            Sleman, Kota Jogja, Bantul, dan Kulon Progo.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga-sewa-karpet" className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-3 text-center text-2xl font-bold text-slate-800 md:text-3xl">
            Harga Sewa Karpet Jogja
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-slate-500">
            Harga bersifat estimasi. Harga akhir menyesuaikan ukuran area,
            durasi sewa, lokasi pengiriman, dan jenis karpet. Hubungi admin
            untuk quote pasti.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-1 text-lg font-bold text-slate-800">
                  {item.name}
                </h3>
                <p className="mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {item.price}
                  </span>
                  <span className="text-sm text-slate-400">{item.unit}</span>
                </p>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Harga di atas bersifat estimasi. Hubungi admin WhatsApp untuk
            quotation pasti sesuai kebutuhan acara Anda.
          </p>
        </div>
      </section>

      {/* Event Types */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-3 text-center text-2xl font-bold text-slate-800 md:text-3xl">
            Jenis Acara yang Dilayani
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-slate-500">
            Santi Living melayani sewa karpet untuk berbagai jenis acara di
            Yogyakarta dan sekitarnya.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.name}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-1 text-base font-bold text-slate-800">
                  {event.name}
                </h3>
                <p className="text-sm text-slate-500">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area Layanan */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-800 md:text-3xl">
            Area Layanan Sewa Karpet Jogja
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-slate-500">
            Santi Living melayani pengiriman dan penjemputan karpet di area
            berikut:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Sleman', 'Kota Jogja', 'Bantul', 'Kulon Progo'].map((area) => (
              <span
                key={area}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Estimasi ongkir menyesuaikan alamat lengkap, akses kendaraan, dan
            jam pengiriman.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-3 text-center text-2xl font-bold text-slate-800 md:text-3xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <FAQAccordion
            items={faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }))}
          />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-6 text-center text-2xl font-bold text-slate-800 md:text-3xl">
            Informasi Terkait
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 text-base font-bold text-blue-600 group-hover:underline">
                Santi Living - Beranda
              </h3>
              <p className="text-sm text-slate-500">
                Sewa kasur, karpet, dan perlengkapan acara di Jogja.
              </p>
            </Link>
            <Link
              href="/harga-sewa-kasur"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 text-base font-bold text-blue-600 group-hover:underline">
                Harga Sewa Kasur
              </h3>
              <p className="text-sm text-slate-500">
                Lihat daftar harga sewa kasur Jogja lengkap dari Santi Living.
              </p>
            </Link>
            <Link
              href="/sewa-perlengkapan-event"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 text-base font-bold text-blue-600 group-hover:underline">
                Paket Perlengkapan Event
              </h3>
              <p className="text-sm text-slate-500">
                Karpet plus kasur, kipas, air cooler, dan TV untuk acara.
              </p>
            </Link>
            <Link
              href="/sewa-karpet-merah-jogja"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 text-base font-bold text-blue-600 group-hover:underline">
                Sewa Karpet Merah Jogja
              </h3>
              <p className="text-sm text-slate-500">
                Karpet merah runner untuk jalur tamu, panggung, dan seremoni.
              </p>
            </Link>
            <Link
              href="/sewa-karpet-permadani-jogja"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-1 text-base font-bold text-blue-600 group-hover:underline">
                Sewa Permadani Jogja
              </h3>
              <p className="text-sm text-slate-500">
                Permadani merah dan emas untuk pengajian, tahlilan, dan lesehan.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-950 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Butuh Sewa Karpet untuk Acara di Jogja?
          </h2>
          <p className="mb-8 text-slate-300">
            Kirim tanggal, lokasi, ukuran area, jenis acara, dan pilihan karpet
            ke WhatsApp kami. Admin akan bantu cek ketersediaan dan estimasi
            harga.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-green-600"
          >
            Chat WhatsApp: {WA_DISPLAY}
          </a>
        </div>
      </section>
    </main>
  );
}
