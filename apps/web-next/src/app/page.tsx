import type { Metadata } from 'next';
import Link from 'next/link';
import { config } from '@/data/config';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';
import { JsonLd } from '@/components/seo/JsonLd';

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
    areaServed: ['Kota Yogyakarta', 'Sleman', 'Bantul', 'Kulonprogo', 'Gunung Kidul'].map((a) => ({ '@type': 'City' as const, name: a })),
  };

  const faqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question' as const,
      name: item.q,
      acceptedAnswer: { '@type': 'Answer' as const, text: item.a },
    })),
  };

  return (
    <main style={{ paddingTop: '70px' }}>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        padding: 'var(--space-12) 0 var(--space-10)',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: 'var(--space-3)', lineHeight: 1.2 }}>
            Sewa Kasur Jogja<br />Terbaik &amp; Terpercaya
          </h1>
          <p style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            marginBottom: 'var(--space-3)',
          }}>
            Mulai Rp25.000/hari
          </p>
          <p style={{ opacity: 0.9, maxWidth: '500px', margin: '0 auto var(--space-6)' }}>
            Rental kasur bersih &amp; murah di Yogyakarta — Antar jemput same day, tanpa ribet
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            {['Bisa antar hari ini', 'Gratis jemput', 'Kasur bersih & wangi'].map((f) => (
              <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                ✅ {f}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <a href="#calculator" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', background: 'white', color: '#1e3a8a' }}>
              Sewa Sekarang
            </a>
            <Link href="/produk" className="btn btn-lg" style={{
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.5)',
              color: 'white',
              background: 'transparent',
            }}>
              Lihat Produk →
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h2 className="section-title">Kenapa Sewa Kasur di Santi Living?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-6)',
          }}>
            {benefits.map((b) => (
              <div key={b.title} style={{
                textAlign: 'center',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{b.icon}</div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)', color: 'var(--color-primary)' }}>{b.title}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <CalculatorSection />

      {/* How To Rent */}
      <section style={{ padding: 'var(--space-10) 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <h2 className="section-title">Cara Sewa Kasur di Santi Living</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-6)',
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                flex: '1 1 140px',
                maxWidth: '160px',
              }}>
                <div style={{
                  fontSize: '2rem',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  margin: '0 auto var(--space-2)',
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary)',
                  marginBottom: '2px',
                }}>
                  Langkah {i + 1}
                </div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Area Layanan Kami</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '500px', margin: '0 auto var(--space-6)' }}>
            Melayani pengiriman kasur sewa ke seluruh Yogyakarta dan sekitarnya
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2)' }}>
            {['Kota Yogyakarta', 'Sleman', 'Bantul', 'Kulonprogo', 'Gunung Kidul'].map((area) => (
              <span key={area} style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                📍 {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'var(--space-10) 0', background: 'var(--color-surface)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 className="section-title">Pertanyaan Umum</h2>
          <div style={{ marginTop: 'var(--space-6)' }}>
            {faqItems.map((item, i) => (
              <details key={i} style={{
                marginBottom: 'var(--space-3)',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}>
                <summary style={{
                  padding: 'var(--space-4)',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-weight-medium)',
                  listStyle: 'none',
                }}>
                  {item.q}
                </summary>
                <div style={{
                  padding: '0 var(--space-4) var(--space-4)',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 1.6,
                }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: 'var(--space-10) 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 'var(--space-3)' }}>
            Siap Sewa Kasur Hari Ini?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: 'var(--space-6)', maxWidth: '480px', margin: '0 auto var(--space-6)' }}>
            Pesan sekarang dan kasur bisa sampai hari ini! Tim kami siap mengantarkan kasur bersih ke lokasi Anda.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <a href="#calculator" className="btn btn-lg" style={{ textDecoration: 'none', background: 'white', color: '#1e3a8a' }}>
              Pesan Sekarang
            </a>
            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              className="btn btn-lg btn-whatsapp"
              target="_blank"
              rel="noopener"
              style={{ textDecoration: 'none' }}
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
