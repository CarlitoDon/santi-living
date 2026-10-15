'use client';

import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import { useLocale } from '@/contexts/locale';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';

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
        <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_size')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_dimensions')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_capacity')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_price_day')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_price_week')}</th>
                <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{t('pricing.table_price_month')}</th>
                <th className="p-3 px-4 font-semibold text-center whitespace-nowrap border-b border-blue-600">{locale === 'en' ? 'Action' : 'Pesan'}</th>
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
                  <td className="p-3 px-4 text-center whitespace-nowrap">
                    <WhatsAppLink
                      message={`Halo Santi Living, saya ingin sewa ${pn(item, locale)} (${type === 'package' ? 'Paket Lengkap' : 'Kasur Busa'}). Mohon info ketersediaan dan pengantaran.`}
                      source={`pricetable_${type}_${item.id}`}
                      location="pricetable_desktop"
                      data-product-category="kasur"
                      data-page-type="service_page"
                      data-wa-intent="sewa_kasur"
                      className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors no-underline"
                    >
                      <span>{locale === 'en' ? 'Book' : 'Pesan'}</span>
                    </WhatsAppLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 md:hidden">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              data-reveal="up"
              data-reveal-delay={String((index % 3) * 35)}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <h3 className="m-0 text-sm font-bold leading-snug text-slate-900">
                  {pn(item, locale)}
                </h3>
                <div className="shrink-0 text-right">
                  <strong className="block text-base text-blue-600">
                    {formatPrice(item.pricePerDay, locale)}
                  </strong>
                  <span className="text-[0.7rem] text-slate-400">
                    {t('pricing.per_day')}
                  </span>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-slate-400">{t('pricing.table_dimensions')}</dt>
                  <dd className="mt-1 font-semibold text-slate-700">{item.dimensions}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">{t('pricing.table_capacity')}</dt>
                  <dd className="mt-1 font-semibold text-slate-700">{pcap(item, locale)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">{t('pricing.table_price_week')}</dt>
                  <dd className="mt-1 font-bold text-blue-600">
                    {formatPrice(item.pricePerDay * 7, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">{t('pricing.table_price_month')}</dt>
                  <dd className="mt-1 font-bold text-blue-600">
                    {formatPrice(item.pricePerDay * 30, locale)}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Unit steril & wangi</span>
                <WhatsAppLink
                  message={`Halo Santi Living, saya ingin sewa ${pn(item, locale)} (${type === 'package' ? 'Paket Lengkap' : 'Kasur Busa'}). Mohon info ketersediaan dan pengantaran.`}
                  source={`pricetable_${type}_${item.id}`}
                  location="pricetable_mobile"
                  data-product-category="kasur"
                  data-page-type="service_page"
                  data-wa-intent="sewa_kasur"
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-colors no-underline shadow-sm"
                >
                  <span>{locale === 'en' ? 'Book via WA' : 'Pesan via WA'}</span>
                  <span aria-hidden="true">→</span>
                </WhatsAppLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
