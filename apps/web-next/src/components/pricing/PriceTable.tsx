import type { Product } from '@/types/product';

import { formatPrice } from '@/utils/currency';

export function PriceTable({ title, desc, items, type }: { title: string; desc: string; items: Product[]; type: string }) {
  return (
    <section className={`py-10 ${type === 'mattress' ? 'bg-slate-50' : ''}`} id={type === 'package' ? 'paket-lengkap' : 'kasur-saja'}>
      <div className="container">
        <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">{title}</h2>
        <p className="text-center text-slate-500 mb-6">{desc}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Ukuran</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Dimensi</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Kapasitas</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Harga/Hari</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Harga/Minggu</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">Harga/Bulan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 px-4 font-semibold whitespace-nowrap text-slate-900">{item.name}</td>
                  <td className="p-3 px-4 text-slate-700">{item.dimensions}</td>
                  <td className="p-3 px-4 text-slate-700">{item.capacity}</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">Rp {formatPrice(item.pricePerDay)}</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">Rp {formatPrice(item.pricePerDay * 7)}</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">Rp {formatPrice(item.pricePerDay * 30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
