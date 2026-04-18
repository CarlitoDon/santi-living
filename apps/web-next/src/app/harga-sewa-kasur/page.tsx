'use client';

import Link from 'next/link';
import { products } from '@/data/products';
import { config } from '@/data/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { PriceTable } from '@/components/pricing/PriceTable';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID').format(price);
}

export default function HargaSewaKasurPage() {
  const itemListSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'OfferCatalog' as const,
    name: 'Daftar Harga Sewa Kasur Busa Jogja',
    description: 'Harga sewa kasur busa harian di Yogyakarta - Santi Living',
    numberOfItems: products.mattressPackages.length + products.mattressOnly.length + products.accessories.length,
    itemListElement: [
      ...products.mattressPackages.concat(products.mattressOnly).map((p, i) => ({
        '@type': 'ListItem' as const,
        position: i + 1,
        item: {
          '@type': 'Product' as const,
          name: p.name,
          description: p.description,
          offers: {
            '@type': 'Offer' as const,
            price: p.pricePerDay,
            priceCurrency: 'IDR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization' as const, name: 'Santi Living' },
          },
        },
      })),
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Berapa harga sewa kasur di Jogja?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Harga sewa kasur di Santi Mebel mulai dari Rp25.000/hari untuk kasur busa saja (ukuran Single Standard 90x200). Untuk paket lengkap (kasur + sprei + bantal + selimut) mulai dari Rp35.000/hari.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah ada diskon untuk sewa banyak?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya! Sewa 3-5 unit dapat diskon 10%, dan sewa 6 unit ke atas dapat diskon 15%.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah ada ongkir gratis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya! Pengiriman GRATIS untuk area dalam radius 3 km dari toko di Godean. Untuk area lain, ongkir mulai dari Rp15.000.',
        },
      },
      {
        '@type': 'Question',
        name: 'Minimal sewa berapa hari?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Minimal sewa 1 hari. Bisa sewa harian, cocok untuk tamu dadakan atau acara singkat.',
        },
      },
    ],
  };

  return (
    <main style={{ paddingTop: '70px', paddingBottom: 0 }}>
      <JsonLd data={itemListSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-[#1a4ea0] py-8 text-center text-white">
        <div className="container">
          <h1 className="text-2xl md:text-3xl mb-2 text-white font-bold">Harga Sewa Kasur di Jogja — Update 2026</h1>
          <p className="text-base text-white/85 m-0 max-w-2xl mx-auto">
            Transparan, terjangkau, dan lengkap. Pilih sesuai kebutuhan kamu.
          </p>
        </div>
      </section>

      {/* Prices */}
      <PriceTable title="📦 Paket Kasur Lengkap" desc="Kasur Busa + Sprei + Bantal + Selimut — tinggal tidur!" items={products.mattressPackages} type="package" />
      <PriceTable title="🛏️ Kasur Busa Saja" desc="Tanpa sprei, bantal, dan selimut — cocok buat yang sudah punya perlengkapan sendiri" items={products.mattressOnly} type="mattress" />

      {/* Ekstra Tambahan */}
      <section className="py-10" id="ekstra">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">✨ Ekstra Tambahan</h2>
          <p className="text-center text-slate-500 mb-6">Butuh tambahan? Pesan satuan juga bisa</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[640px] mx-auto">
            {products.accessories.map((item) => (
              <div className="bg-white border border-slate-200 rounded-md p-4 text-center" key={item.id}>
                <div className="font-semibold mb-1 text-slate-900">{item.name}</div>
                <div className="text-blue-600 font-bold text-lg">Rp {formatPrice(item.pricePerDay)}<span className="text-sm font-normal text-slate-500">/hari</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diskon Sewa Banyak */}
      <section className="py-10 bg-slate-50" id="diskon">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">🎉 Diskon Sewa Banyak</h2>
          <p className="text-center text-slate-500 mb-6">Semakin banyak kasur yang disewa, semakin hemat!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {config.volumeDiscounts.filter((d) => d.discount > 0).map((d, i) => (
              <div className="bg-white border-2 border-blue-600 rounded-lg py-4 px-6 text-center min-w-[140px]" key={i}>
                <div className="text-sm text-slate-500 mb-1">{d.minQty}-{d.maxQty > 100 ? '∞' : d.maxQty} unit</div>
                <div className="text-lg font-bold text-blue-600">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongkir */}
      <section className="py-10" id="ongkir">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">🚚 Biaya Pengiriman</h2>
          <p className="text-center text-slate-500 mb-6">Antar jemput ke lokasi kamu di area Jogja</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white max-w-[640px] mx-auto">
            <table className="w-full border-collapse text-sm text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Jarak dari Toko</th>
                  <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Biaya Ongkir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {config.deliveryZones.map((zone, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-3 px-4 text-slate-800">≤ {zone.maxDistance} km</td>
                    <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">{zone.price === 0 ? '🎉 GRATIS' : `Rp ${formatPrice(zone.price)}`}</td>
                  </tr>
                ))}
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 px-4 text-slate-800">&gt; {config.deliveryZones[config.deliveryZones.length - 1].maxDistance} km</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">Rp {formatPrice(config.deliveryPricePerKm)}/km</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center mt-4 text-slate-500 text-sm">📍 Lokasi toko: {config.storeLocation.name} (Jl. Godean KM 10)</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-slate-50" id="faq-harga">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-6 font-bold text-slate-900">❓ Pertanyaan Umum Tentang Harga</h2>
          <div className="max-w-[640px] mx-auto space-y-3">
            <details className="group border border-slate-200 rounded-md bg-white overflow-hidden">
              <summary className="p-4 cursor-pointer font-semibold list-none flex items-center justify-between text-slate-800 group-open:text-blue-600">
                Berapa harga sewa kasur di Jogja?
                <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-4 pb-4 text-slate-500 leading-relaxed m-0 border-t border-slate-100 pt-3 mt-1">Harga sewa kasur di Santi Mebel mulai dari Rp25.000/hari untuk kasur busa saja (ukuran Single Standard 90x200). Untuk paket lengkap (kasur + sprei + bantal + selimut) mulai dari Rp35.000/hari.</p>
            </details>
            <details className="group border border-slate-200 rounded-md bg-white overflow-hidden">
              <summary className="p-4 cursor-pointer font-semibold list-none flex items-center justify-between text-slate-800 group-open:text-blue-600">
                Apakah ada diskon untuk sewa banyak?
                <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-4 pb-4 text-slate-500 leading-relaxed m-0 border-t border-slate-100 pt-3 mt-1">Ya! Sewa 3-5 unit dapat diskon 10%, dan sewa 6 unit ke atas dapat diskon 15%. Cocok untuk acara, kos-kosan, atau penginapan.</p>
            </details>
            <details className="group border border-slate-200 rounded-md bg-white overflow-hidden">
              <summary className="p-4 cursor-pointer font-semibold list-none flex items-center justify-between text-slate-800 group-open:text-blue-600">
                Apakah ada ongkir gratis?
                <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-4 pb-4 text-slate-500 leading-relaxed m-0 border-t border-slate-100 pt-3 mt-1">Ya! Pengiriman GRATIS untuk area dalam radius 3 km dari toko kami di Godean. Untuk area lain, ongkir mulai dari Rp15.000.</p>
            </details>
            <details className="group border border-slate-200 rounded-md bg-white overflow-hidden">
              <summary className="p-4 cursor-pointer font-semibold list-none flex items-center justify-between text-slate-800 group-open:text-blue-600">
                Minimal sewa berapa hari?
                <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-4 pb-4 text-slate-500 leading-relaxed m-0 border-t border-slate-100 pt-3 mt-1">Minimal sewa 1 hari. Yap, bisa sewa harian! Cocok untuk tamu dadakan atau acara singkat.</p>
            </details>
            <details className="group border border-slate-200 rounded-md bg-white overflow-hidden">
              <summary className="p-4 cursor-pointer font-semibold list-none flex items-center justify-between text-slate-800 group-open:text-blue-600">
                Apakah harga sudah termasuk antar jemput?
                <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-4 pb-4 text-slate-500 leading-relaxed m-0 border-t border-slate-100 pt-3 mt-1">Harga kasur belum termasuk ongkir. Tapi untuk area Godean (radius 3 km), pengiriman GRATIS!</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-[#1a4ea0] py-10 text-center text-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl text-white mb-2 font-bold">Mau sewa kasur sekarang?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">Hubungi kami via WhatsApp untuk order atau tanya-tanya</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#calculator" className="bg-white text-blue-600 max-w-[280px] w-full border-none py-3 px-6 rounded-md font-semibold hover:bg-slate-50 transition-colors text-center no-underline">
              Hitung Biaya Sewa
            </Link>
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=Halo%20Santi%20Mebel,%20saya%20mau%20tanya%20harga%20sewa%20kasur`}
              className="max-w-[280px] w-full bg-transparent text-white border-2 border-white/50 no-underline py-3 px-6 rounded-md font-semibold hover:bg-white/15 hover:border-white transition-colors flex justify-center items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
