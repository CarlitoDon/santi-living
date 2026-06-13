'use client';

import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import { useLocale } from '@/contexts/locale';

/** Return locale-appropriate name */
function pn(item: Product, locale: string): string {
  return locale === 'en' && item.name_en ? item.name_en : item.name;
}
/** Return locale-appropriate capacity */
function pcap(item: Product, locale: string): string | undefined {
  return locale === 'en' && item.capacity_en ? item.capacity_en : item.capacity;
}

export function PriceTable({ title, desc, items, type }: { title: string; desc: string; items: Product[]; type: string }) {
  const { locale, t } = useLocale();

  return (
    <section className={`py-10 ${type === 'mattress' ? 'bg-slate-50' : ''}`} id={type === 'package' ? 'paket-lengkap' : 'kasur-saja'}>
      <div className="container">
        <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">{title}</h2>
        <p className="text-center text-slate-500 mb-6">{desc}</p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_size')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_dimensions')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_capacity')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_price_day')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_price_week')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_price_month')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 px-4 font-semibold whitespace-nowrap text-slate-900">{pn(item, locale)}</td>
                  <td className="p-3 px-4 text-slate-700">{item.dimensions}</td>
                  <td className="p-3 px-4 text-slate-700">{pcap(item, locale)}</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">{formatPrice(item.pricePerDay, locale)}</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">{formatPrice(item.pricePerDay * 7, locale)}</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">{formatPrice(item.pricePerDay * 30, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
