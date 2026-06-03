'use client';

import { getWhatsAppUrl } from '@/utils/whatsapp';

type CarpetProduct = {
  id: string;
  name: string;
  size: string;
  statusLabel: string;
  note: string;
  includes: string[];
  intent: string;
  badge?: string;
};

type CarpetCategory = {
  id: string;
  title: string;
  description?: string;
  items: CarpetProduct[];
};

const carpetCategories: CarpetCategory[] = [
  {
    id: 'acara',
    title: 'Karpet Acara',
    description: 'Untuk event, panggung, booth, akad, hajatan, dan jalur tamu.',
    items: [
      {
        id: 'karpet-merah-runner',
        name: 'Karpet Merah / Red Carpet',
        size: 'Runner, jalur VIP, wedding, grand opening',
        statusLabel: 'Cek ukuran dan stok',
        note: 'Kirim panjang jalur, lebar area, tanggal, jam kirim, dan lokasi venue.',
        includes: ['Jalur tamu formal', 'Indoor atau outdoor by request', 'Estimasi setelah ukuran jelas'],
        intent: 'sewa_karpet_merah',
        badge: 'High intent',
      },
      {
        id: 'karpet-pameran-booth',
        name: 'Karpet Pameran / Booth',
        size: 'Layout custom untuk expo, seminar, bazar',
        statusLabel: 'Estimasi luas area',
        note: 'Admin bantu hitung kebutuhan dari denah, foto booth, atau ukuran panjang x lebar.',
        includes: ['Booth UMKM dan expo', 'Panggung kecil', 'Koordinasi delivery venue'],
        intent: 'sewa_karpet_pameran',
      },
      {
        id: 'paket-karpet-acara',
        name: 'Paket Perlengkapan Acara',
        size: 'Karpet + kasur + kipas / air cooler + TV',
        statusLabel: 'Konsultasi bundle',
        note: 'Untuk panitia yang butuh satu pintu logistik perlengkapan acara di Jogja.',
        includes: ['Karpet by request', 'Kasur tamu keluarga', 'Pendingin dan TV sesuai stok'],
        intent: 'paket_perlengkapan_acara',
      },
    ],
  },
  {
    id: 'permadani',
    title: 'Karpet Permadani',
    description: 'Untuk pengajian, tahlilan, syukuran, dan acara keluarga lesehan.',
    items: [
      {
        id: 'karpet-permadani-lesehan',
        name: 'Karpet Permadani Lesehan',
        size: 'Area tamu, ruang keluarga, musala kecil',
        statusLabel: 'Cek motif dan ukuran',
        note: 'Sertakan jumlah tamu atau ukuran ruang agar estimasi tidak meleset.',
        includes: ['Pengajian dan tahlilan', 'Acara keluarga', 'Duduk lesehan rapi'],
        intent: 'sewa_karpet_permadani',
        badge: 'Pengajian',
      },
      {
        id: 'karpet-ruang-tamu',
        name: 'Karpet Ruang Tamu Sementara',
        size: 'Tambahan alas untuk rumah, homestay, villa',
        statusLabel: 'By request',
        note: 'Cocok saat menerima tamu luar kota atau membuat ruang kumpul sementara.',
        includes: ['Ruang tamu sementara', 'Homestay dan villa', 'Bisa bundle kasur tamu'],
        intent: 'karpet_tamu_keluarga',
      },
    ],
  },
];

function buildKarpetWaText(product: CarpetProduct): string {
  return `Halo Santi Living, saya ingin cek ketersediaan ${product.name} di Jogja.

Detail acara:
Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Ukuran area: {panjang x lebar / estimasi jumlah tamu}
Kebutuhan: ${product.name} - ${product.size}

Mohon info ketersediaan, rekomendasi ukuran, estimasi harga, dan ongkirnya.`;
}

export function KarpetCalculatorSection() {
  return (
    <section id="calculator" className="relative z-[10] -mt-6 bg-slate-50 pb-10 md:-mt-10 md:pb-14">
      <div className="container">
        <div className="w-full max-w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-950/10 md:p-7">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Opsi Sewa Karpet
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
              Pilih kebutuhan karpet untuk dicek admin
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
              Harga dan stok karpet tidak dipatok final di halaman ini. Pilih kebutuhan Anda, lalu kirim detail ukuran, tanggal, dan lokasi agar admin bisa memberi estimasi yang valid.
            </p>
          </div>

          <div className="space-y-6">
            {carpetCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {category.title}
                  </p>
                  {category.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 w-full min-w-0 md:grid-cols-2 xl:grid-cols-3">
                  {category.items.map((product) => (
                    <article
                      key={product.id}
                      className="flex h-full flex-col min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-white hover:shadow-md"
                      data-product-id={product.id}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{product.size}</p>
                        </div>
                        {product.badge && (
                          <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <p className="mb-2 text-xl font-extrabold text-indigo-700">{product.statusLabel}</p>
                      <p className="mb-4 text-sm leading-relaxed text-slate-600">{product.note}</p>

                      <ul className="mb-5 mt-auto space-y-1.5 text-xs text-slate-500">
                        {product.includes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-indigo-500">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="border-t border-slate-200 pt-4">
                        <a
                          href={getWhatsAppUrl(buildKarpetWaText(product), `karpet_${product.id}`)}
                          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                          target="_blank"
                          rel="noopener"
                          data-wa-source={`karpet_${product.id}`}
                          data-wa-location="karpet_options"
                          data-product-category="karpet"
                          data-page-type="option_selector"
                          data-wa-intent={product.intent}
                        >
                          Cek via WhatsApp
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
