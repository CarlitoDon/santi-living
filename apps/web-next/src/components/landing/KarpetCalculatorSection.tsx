'use client';

import { useCalculatorContext } from '@/contexts/CalculatorContext';

type CarpetProduct = {
  id: string;
  name: string;
  size: string;
  pricePerDay: number;
  priceLabel: string;
  note: string;
  includes: string[];
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
    description: 'Untuk event, panggung, booth, akad, dan hajatan.',
    items: [
      {
        id: 'karpet-lorong-1m',
        name: 'Karpet Event Kecil / Lorong',
        size: 'Lebar 1m • panjang sesuai kebutuhan',
        pricePerDay: 10000,
        priceLabel: 'Mulai Rp10.000/meter/hari',
        note: 'Untuk lorong masuk, jalur tamu, atau alas area kecil.',
        includes: ['Karpet lorong 1 meter', 'Estimasi hitung per meter', 'Antar jemput sesuai area'],
        badge: 'Meteran',
      },
      {
        id: 'karpet-sedang-2x3',
        name: 'Karpet Sedang',
        size: 'Ukuran 2m x 3m',
        pricePerDay: 45000,
        priceLabel: 'Rp45.000/hari',
        note: 'Pas untuk akad, area VIP kecil, atau dekorasi ruang keluarga.',
        includes: ['Karpet ukuran 2x3m', 'Karpet dibersihkan sebelum kirim', 'Jemput setelah selesai sewa'],
        badge: 'Best Value',
      },
      {
        id: 'karpet-besar-3x4',
        name: 'Karpet Besar',
        size: 'Ukuran 3m x 4m',
        pricePerDay: 65000,
        priceLabel: 'Rp65.000/hari',
        note: 'Cocok untuk panggung kecil, lesehan keluarga, atau gathering.',
        includes: ['Karpet ukuran 3x4m', 'Cocok untuk lesehan dan panggung', 'Antar jemput sesuai jadwal'],
      },
      {
        id: 'karpet-booth-panggung',
        name: 'Karpet Area Booth / Panggung',
        size: 'Custom setup • estimasi per area',
        pricePerDay: 85000,
        priceLabel: 'Estimasi mulai Rp85.000/hari',
        note: 'Untuk booth pameran, panggung, bazaar, atau layout multi-area.',
        includes: ['Konsultasi kebutuhan area', 'Estimasi ukuran custom', 'Koordinasi kirim ke lokasi acara'],
      },
      {
        id: 'karpet-vip-dekoratif',
        name: 'Karpet VIP / Dekoratif',
        size: 'Karpet tebal / premium by request',
        pricePerDay: 120000,
        priceLabel: 'Estimasi mulai Rp120.000/hari',
        note: 'Untuk event eksklusif, dekorasi VIP, atau kebutuhan tampilan rapi.',
        includes: ['Opsi premium by request', 'Disesuaikan dengan ketersediaan', 'Konsultasi via WhatsApp'],
      },
    ],
  },
  {
    id: 'madani',
    title: 'Karpet Madani',
    description: 'Untuk pengajian, tahlilan, dan acara keluarga.',
    items: [
      {
        id: 'karpet-madani-runner-1x5',
        name: 'Karpet Madani Runner',
        size: 'Lebar 1m x 5m',
        pricePerDay: 30000,
        priceLabel: 'Rp30.000/hari',
        note: 'Cocok untuk shaf kecil, lorong, atau area pintu masuk.',
        includes: ['Motif madani', 'Karpet digulung rapi', 'Antar jemput sesuai area'],
        badge: 'Madani',
      },
      {
        id: 'karpet-madani-2x3',
        name: 'Karpet Madani 2x3',
        size: 'Ukuran 2m x 3m',
        pricePerDay: 55000,
        priceLabel: 'Rp55.000/hari',
        note: 'Pas untuk pengajian keluarga atau ruang tamu.',
        includes: ['Karpet tebal motif madani', 'Dibersihkan sebelum kirim', 'Jemput setelah selesai sewa'],
        badge: 'Favorit',
      },
      {
        id: 'karpet-madani-3x4',
        name: 'Karpet Madani 3x4',
        size: 'Ukuran 3m x 4m',
        pricePerDay: 80000,
        priceLabel: 'Rp80.000/hari',
        note: 'Ideal untuk aula kecil, musala, atau acara syukuran.',
        includes: ['Karpet tebal & empuk', 'Cocok untuk lesehan', 'Antar jemput sesuai jadwal'],
      },
    ],
  },
];

export function KarpetCalculatorSection() {
  const { actions } = useCalculatorContext();

  return (
    <section id="calculator" className="relative z-[10] -mt-6 bg-slate-50 pb-10 md:-mt-10 md:pb-14">
      <div className="container">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-950/10 md:p-7">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Kalkulator Sewa Karpet
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
              ⚡️ Pilih Karpet
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
              Tambahkan ukuran karpet yang dibutuhkan untuk estimasi sewa harian. Untuk area custom, admin akan bantu finalisasi ukuran dan ongkir via WhatsApp.
            </p>
          </div>

          <div className="space-y-6">
            {carpetCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {category.title}
                  </p>
                  {category.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {category.items.map((product) => {
                    const quantity = actions.getItemQuantity(product.id);

                    return (
                      <article
                        key={product.id}
                        className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-white hover:shadow-md"
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

                        <p className="mb-2 text-xl font-extrabold text-indigo-700">{product.priceLabel}</p>
                        <p className="mb-4 text-sm leading-relaxed text-slate-600">{product.note}</p>

                        <ul className="mb-5 mt-auto space-y-1.5 text-xs text-slate-500">
                          {product.includes.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-indigo-500">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                          <div className="text-xs text-slate-500">
                            {quantity > 0 ? `${quantity} item dipilih` : 'Belum dipilih'}
                          </div>
                          {quantity > 0 ? (
                            <div className="flex items-center rounded-full border border-indigo-200 bg-white p-1">
                              <button
                                type="button"
                                onClick={() => actions.removeItem(product.id)}
                                className="grid h-8 w-8 place-items-center rounded-full text-lg font-bold text-indigo-700 hover:bg-indigo-50"
                                aria-label={`Kurangi ${product.name}`}
                              >
                                −
                              </button>
                              <span className="min-w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => actions.addItem({
                                  id: product.id,
                                  name: product.name,
                                  category: 'accessory',
                                  pricePerDay: product.pricePerDay,
                                  includes: product.includes,
                                })}
                                className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-lg font-bold text-white hover:bg-indigo-700"
                                aria-label={`Tambah ${product.name}`}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => actions.addItem({
                                id: product.id,
                                name: product.name,
                                category: 'accessory',
                                pricePerDay: product.pricePerDay,
                                includes: product.includes,
                              })}
                              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                              aria-label={`Tambahkan ${product.name}`}
                            >
                              + Tambah
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
