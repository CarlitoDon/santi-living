import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { config } from '@/data/config';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroBackground } from '@/components/home/HeroBackground';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { generateFAQSchema } from '@/utils/seo';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export const metadata: Metadata = {
  title: 'Sewa Kasur Jogja Terbaik - Antar Jemput Same Day | Santi Living',
  description:
    'Sewa kasur bersih di Jogja mulai Rp25.000/hari. ✅ Antar jemput same day ✅ Gratis ongkir area tertentu ✅ Kasur premium & steril ✅ Order via WhatsApp. Santi Living Yogyakarta.',
};

const faqItems = [
  { q: 'Berapa harga sewa kasur di Jogja?', a: 'Mulai dari Rp25.000/hari untuk kasur busa single. Paket lengkap (kasur + sprei + bantal + selimut) mulai Rp35.000/hari.' },
  { q: 'Apakah bisa antar hari ini?', a: 'Ya! Pesan sebelum jam 15:00 WIB dan kasur bisa sampai di hari yang sama untuk area Jogja, Sleman, dan Bantul.' },
  { q: 'Bagaimana cara memesan?', a: 'Sangat mudah — pilih kasur, isi formulir pemesanan, dan lakukan pembayaran. Tim kami akan langsung mengantar kasur ke lokasi Anda.' },
  { q: 'Apakah kasur sewaan bersih?', a: 'Ya, setiap kasur kami cuci dan sterilkan sebelum dikirim. Kami juga menyediakan sprei bersih dan bantal baru untuk setiap pelanggan.' },
  { q: 'Apa saja area jangkauan pengiriman?', a: 'Kami melayani seluruh area Yogyakarta: Sleman, Bantul, Kota Jogja, Kulonprogo, dan Gunung Kidul. Area terdekat dari Godean mendapat gratis ongkir!' },
  { q: 'Berapa lama minimal sewa?', a: 'Minimal sewa 1 hari. Anda bisa sewa harian, mingguan, atau bulanan sesuai kebutuhan.' },
];

const steps = [
  { icon: '📱', title: 'Pilih Kasur', desc: 'Pilih ukuran dan jumlah kasur yang dibutuhkan' },
  { icon: '📝', title: 'Isi Formulir', desc: 'Lengkapi data diri dan alamat pengiriman' },
  { icon: '💳', title: 'Bayar', desc: 'Bayar via QRIS, Transfer, atau GoPay' },
  { icon: '🚚', title: 'Kasur Diantar', desc: 'Tim kami antar kasur ke lokasi Anda' },
  { icon: '📞', title: 'Selesai', desc: 'Hubungi kami saat masa sewa berakhir untuk penjemputan' },
];

const benefits = [
  { icon: '✨', title: 'Bersih & Steril', desc: 'Setiap kasur melalui proses pembersihan dan sterilisasi profesional' },
  { icon: '🚀', title: 'Same Day Delivery', desc: 'Pesan sebelum jam 15:00, kasur sampai hari ini untuk area Jogja' },
  { icon: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi, harga sudah termasuk sprei & bantal' },
  { icon: '📦', title: 'Stok Selalu Ready', desc: '100+ unit kasur siap kirim kapanpun Anda butuhkan' },
  { icon: '🔄', title: 'Fleksibel', desc: 'Sewa harian, mingguan, atau bulanan — sesuai kebutuhan Anda' },
  { icon: '📍', title: 'Gratis Jemput', desc: 'Pengambilan kasur gratis saat masa sewa berakhir' },
];

const features = ['Bisa antar hari ini', 'Gratis jemput', 'Kasur bersih & wangi'];
const serviceAreas = ['Kota Yogyakarta', 'Sleman', 'Bantul', 'Kulonprogo', 'Gunung Kidul'];

export default function HomePage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    name: 'Santi Living',
    description: metadata.description,
    url: 'https://santiliving.com',
    telephone: `+${config.whatsappNumber}`,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Jl. Godean KM 5',
      addressLocality: 'Yogyakarta',
      addressRegion: 'DI Yogyakarta',
      postalCode: '55564',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: config.storeLocation.lat,
      longitude: config.storeLocation.lng,
    },
    areaServed: serviceAreas.map((a) => ({ '@type': 'City' as const, name: a })),
  };

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <main className="pt-[80px]">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      {/* ===== HERO ===== */}
      <section className="relative py-16 md:py-24 text-center text-white overflow-hidden min-h-[55vh] flex items-center">
        <HeroBackground />

        <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.15)_0%,transparent_70%)] pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 w-full">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-1 rounded-full text-xs tracking-wider uppercase mb-4">
            🏆 #1 Rental Kasur di Yogyakarta
          </div>
          <h1 className="text-[clamp(2rem,6vw,3rem)] leading-[1.15] font-extrabold mb-4">
            Sewa Kasur Jogja<br />Terbaik &amp; Terpercaya
          </h1>
          <p className="inline-block bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xs border border-white/20 px-6 py-2 rounded-full text-lg font-bold mb-4">
            Mulai Rp25.000/hari
          </p>
          <p className="opacity-85 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
            Rental kasur bersih &amp; murah di Yogyakarta — Antar jemput same day, tanpa ribet
          </p>

          {/* Feature badges */}
          <div className="flex justify-center gap-3 flex-wrap mb-8">
            <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full">
              ✨ Sterilisasi UV-C & Vacuum
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full">
              🛡️ Busa INOAC / Swallow High Density
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full">
              🚚 Same Day Delivery Jogja
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center px-8 py-3 bg-white !text-[#1e3a8a] font-bold rounded-md shadow-lg hover:bg-gray-50 transition-colors"
            >
              Sewa Sekarang
            </a>
            <Link
              href="/produk"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/40 bg-white/8 backdrop-blur-xs !text-white rounded-md hover:bg-white/15 transition-colors"
            >
              Lihat Produk →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRUST & HYGIENE SECTION ===== */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Kenapa Memilih Santi Living?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            Kami bukan sekadar persewaan kasur. Kami memberikan jaminan kenyamanan dan kesehatan untuk setiap malam Anda di Yogyakarta.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✨</div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">7 Tahap Higienitas</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Setiap unit melewati proses Vacuum industrial, sterilisasi UV-C, hingga pembungkusan plastik kedap udara sebelum dikirim.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🏅</div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Merk Terpercaya</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Hanya menggunakan busa berkualitas tinggi (High Density) dari brand ternama seperti INOAC dan Swallow. Anti kempes!
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🚀</div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Same Day Jogja</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Layanan pengantaran kilat 2-4 jam untuk area Jogja, Sleman, dan Bantul. Pesan pagi, siang sudah bisa dipakai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-8">
            Kenapa Sewa Kasur di Santi Living?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((b) => (
              <FeatureCard key={b.title} icon={b.icon} title={b.title} description={b.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALCULATOR ===== */}
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Memuat kalkulator...</div>}>
        <CalculatorSection />
      </Suspense>

      {/* ===== HOW TO RENT ===== */}
      <section className="py-12 md:py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-8">
            Cara Sewa Kasur di Santi Living
          </h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center flex-1 min-w-[130px] max-w-[160px]">
                <div className="text-2xl w-14 h-14 flex items-center justify-center rounded-full bg-primary-light mx-auto mb-2">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-primary mb-0.5">Langkah {i + 1}</div>
                <h3 className="text-sm font-bold mb-1">{s.title}</h3>
                <p className="text-xs text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICE AREA ===== */}
      <section id="service-area" className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Area Layanan Kami</h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-6">
            Melayani pengiriman kasur sewa ke seluruh Yogyakarta dan sekitarnya
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-primary-light text-primary font-medium text-sm rounded-full"
              >
                📍 {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-12 md:py-16 bg-surface">
        <div className="max-w-2xl mx-auto px-4">
          <FAQAccordion items={faqItems} title="Pertanyaan Umum" />
        </div>
      </section>

      {/* ===== LOCATION / MAPS ===== */}
      <section id="location" className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Lokasi Kami</h2>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Kunjungi workshop kami di Godean untuk melihat langsung unit kasur kami. Kami siap melayani pengantaran ke seluruh area DIY.
              </p>
              <address className="not-italic bg-surface p-5 rounded-xl border border-border">
                <p className="font-bold text-primary mb-1">Workshop Santi Living</p>
                <p className="text-sm text-text-secondary mb-3">
                  Jl. Godean KM 10 Geneng, RT.05/RW.04,<br />
                  Sidoagung, Kec. Godean, Kabupaten Sleman,<br />
                  DI Yogyakarta 55264
                </p>
                <a 
                  href="https://maps.app.goo.gl/DiUP3REYVqYBHtuA8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                >
                  📍 Lihat di Google Maps
                </a>
              </address>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card h-[300px] md:h-[350px] border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.73!2d110.2938902!3d-7.7673015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af78e36749823%3A0x52e28f33378aaa99!2zU2V3YSBLYXN1ciBKb2dqYSAtIFNhbnRpIExpdmluZw!5e0!3m2!1sen!2sid!4v1713400000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - Santi Living"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">Siap Sewa Kasur Hari Ini?</h2>
          <p className="opacity-90 mb-8 leading-relaxed">
            Pesan sekarang dan kasur bisa sampai hari ini! Tim kami siap mengantarkan kasur bersih ke lokasi Anda.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#1e3a8a] font-bold rounded-md hover:bg-gray-50 transition-colors"
            >
              Pesan Sekarang
            </a>
            <a
              href={getWhatsAppUrl()}
              className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-hover transition-colors"
              target="_blank"
              rel="noopener"
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
