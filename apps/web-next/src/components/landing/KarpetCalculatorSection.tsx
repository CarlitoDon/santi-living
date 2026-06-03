'use client';

import { useMemo } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { getWhatsAppUrl } from '@/utils/whatsapp';

type CarpetProduct = {
  id: string;
  name: string;
  shortName: string;
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
        shortName: 'Karpet Merah',
        size: 'Runner, jalur VIP, wedding, grand opening',
        statusLabel: 'Cek ukuran & stok',
        note: 'Kirim panjang jalur, lebar area, tanggal, jam kirim, dan lokasi venue.',
        includes: ['Jalur tamu formal', 'Indoor atau outdoor by request', 'Estimasi setelah ukuran jelas'],
        intent: 'sewa_karpet_merah',
        badge: 'High intent',
      },
      {
        id: 'karpet-pameran-booth',
        name: 'Karpet Pameran / Booth',
        shortName: 'Karpet Booth',
        size: 'Layout custom untuk expo, seminar, bazar',
        statusLabel: 'Estimasi luas area',
        note: 'Admin bantu hitung kebutuhan dari denah, foto booth, atau ukuran panjang x lebar.',
        includes: ['Booth UMKM dan expo', 'Panggung kecil', 'Koordinasi delivery venue'],
        intent: 'sewa_karpet_pameran',
      },
      {
        id: 'paket-karpet-acara',
        name: 'Paket Perlengkapan Acara',
        shortName: 'Paket Acara',
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
        shortName: 'Permadani Lesehan',
        size: 'Area tamu, ruang keluarga, musala kecil',
        statusLabel: 'Cek motif & ukuran',
        note: 'Sertakan jumlah tamu atau ukuran ruang agar estimasi tidak meleset.',
        includes: ['Pengajian dan tahlilan', 'Acara keluarga', 'Duduk lesehan rapi'],
        intent: 'sewa_karpet_permadani',
        badge: 'Pengajian',
      },
      {
        id: 'karpet-ruang-tamu',
        name: 'Karpet Ruang Tamu Sementara',
        shortName: 'Karpet Tamu',
        size: 'Tambahan alas untuk rumah, homestay, villa',
        statusLabel: 'By request',
        note: 'Cocok saat menerima tamu luar kota atau membuat ruang kumpul sementara.',
        includes: ['Ruang tamu sementara', 'Homestay dan villa', 'Bisa bundle kasur tamu'],
        intent: 'karpet_tamu_keluarga',
      },
    ],
  },
];

const allCarpetProducts = carpetCategories.flatMap((category) => category.items);
const carpetProductIds = new Set(allCarpetProducts.map((product) => product.id));

function buildKarpetWaText(items: Array<{ name: string; quantity: number }>): string {
  const selected = items
    .map((item) => `- ${item.name} x${item.quantity}`)
    .join('\n');

  return `Halo Santi Living, saya ingin cek ketersediaan sewa karpet Jogja.

Pilihan karpet:
${selected}

Detail acara:
Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Ukuran area: {panjang x lebar / estimasi jumlah tamu}

Mohon info ketersediaan, rekomendasi ukuran, estimasi harga, dan ongkirnya.`;
}

function ProductStepper({ product }: { product: CarpetProduct }) {
  const { actions } = useCalculatorContext();
  const quantity = actions.getItemQuantity(product.id);

  const handleAdd = () => {
    actions.addItem({
      id: product.id,
      name: product.name,
      category: 'accessory',
      pricePerDay: 0,
      includes: product.includes,
    });
  };

  return (
    <article
      className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-white hover:shadow-md"
      data-product-id={product.id}
      data-product-category="karpet"
      data-wa-intent={product.intent}
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
        {quantity > 0 ? (
          <div className="flex items-center justify-between gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-indigo-100">
            <button
              type="button"
              onClick={() => actions.removeItem(product.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg font-bold text-slate-600 hover:border-red-300 hover:text-red-500"
              aria-label={`Kurangi ${product.name}`}
            >
              −
            </button>
            <span className="text-sm font-extrabold text-slate-900">
              {quantity} dipilih
            </span>
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white hover:bg-indigo-700"
              aria-label={`Tambah ${product.name}`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
            aria-label={`Tambah ${product.name} ke pilihan karpet`}
          >
            + Tambah
          </button>
        )}
      </div>
    </article>
  );
}

export function KarpetCalculatorSection() {
  return (
    <section id="calculator" className="relative z-[10] -mt-6 bg-slate-50 pb-10 md:-mt-10 md:pb-14">
      <div className="container">
        <div className="w-full max-w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-950/10 md:p-7">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Kalkulator / Selector Sewa Karpet
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
              Pilih Karpet untuk dihitung admin
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
              Klik <strong>+ Tambah</strong> pada opsi karpet yang dibutuhkan. Bar pilihan akan muncul di bawah, lalu kirim ringkasan ke WhatsApp agar admin bisa menghitung stok, ukuran, ongkir, cleaning, dan estimasi biaya yang valid.
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

                <div className="grid w-full min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {category.items.map((product) => (
                    <ProductStepper key={product.id} product={product} />
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

export function KarpetCartBar() {
  const { actions } = useCalculatorContext();
  const selectedItems = useMemo(
    () => actions.state.items.filter((item) => carpetProductIds.has(item.id)),
    [actions.state.items],
  );
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity === 0) return null;

  const summary = selectedItems
    .map((item) => `${item.name} x${item.quantity}`)
    .join(', ');

  return (
    <div className="cart-bar">
      <div className="cart-bar-inner">
        <div className="cart-bar-info">
          <span className="cart-bar-count">{totalQuantity} opsi karpet</span>
          <span className="cart-bar-price text-sm leading-tight">
            {summary}
          </span>
        </div>
        <a
          href={getWhatsAppUrl(buildKarpetWaText(selectedItems), 'karpet_cart_bar')}
          className="cart-bar-btn text-center no-underline"
          target="_blank"
          rel="noopener noreferrer"
          data-wa-source="karpet_cart_bar"
          data-wa-location="karpet_cart_bar"
          data-product-category="karpet"
          data-page-type="calculator"
          data-wa-intent="karpet_cart_checkout"
        >
          Kirim WA →
        </a>
      </div>
    </div>
  );
}
