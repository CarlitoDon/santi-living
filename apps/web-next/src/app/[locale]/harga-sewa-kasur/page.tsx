'use client';

import Link from 'next/link';
import { products } from '@/data/products';
import { config } from '@/data/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { PriceTable } from '@/components/pricing/PriceTable';
import { PageHero } from '@/components/layout/PageHero';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { generateProductSchemaList, generateFAQSchema } from '@/utils/seo';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import { formatPrice } from '@/utils/currency';
import { useT, useDictionary, useLocale } from '@/contexts/locale';
import { localeHref } from '@/utils/localeHref';

export default function HargaSewaKasurPage() {
  const t = useT();
  const dict = useDictionary();
  const { locale } = useLocale();

  const hs = (key: string) => t(`harga_sewa.${key}`);
  const pr = (key: string) => t(`pricing.${key}`);

  const hargaSewaRaw = dict.harga_sewa;
  const faqItems = hargaSewaRaw && typeof hargaSewaRaw === 'object'
    ? ((hargaSewaRaw as Record<string, unknown>).faq_items as Array<{ q: string; a: string }>) || []
    : [];

  const faqSchema = generateFAQSchema(faqItems);

  const itemListSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'OfferCatalog' as const,
    name: 'Daftar Harga Sewa Kasur Busa Jogja',
    description: 'Harga sewa kasur busa harian di Yogyakarta - Santi Living',
    numberOfItems: products.mattressPackages.length + products.mattressOnly.length + products.accessories.length,
    itemListElement: generateProductSchemaList([...products.mattressPackages, ...products.mattressOnly], 1)
  };

  return (
    <main style={{ paddingTop: '80px', paddingBottom: 0 }}>
      <JsonLd data={itemListSchema} />
      <JsonLd data={faqSchema} />

      <PageHero 
        title={hs('hero_title')}
        subtitle={hs('hero_subtitle')}
      />

      {/* Prices */}
      <PriceTable title={t('produk.paket_lengkap_title')} desc={t('produk.paket_lengkap_desc')} items={products.mattressPackages} type="package" />
      <PriceTable title={t('produk.kasur_only_title')} desc={t('produk.kasur_only_desc')} items={products.mattressOnly} type="mattress" />

      {/* Ekstra Tambahan */}
      <section className="py-10" id="ekstra">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">{hs('ekstra_title')}</h2>
          <p className="text-center text-slate-500 mb-6">{hs('ekstra_desc')}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[640px] mx-auto">
            {products.accessories.map((item) => (
              <div className="bg-white border border-slate-200 rounded-md p-4 text-center" key={item.id}>
                <div className="font-semibold mb-1 text-slate-900">{item.name}</div>
                <div className="text-blue-600 font-bold text-lg">{formatPrice(item.pricePerDay)}<span className="text-sm font-normal text-slate-500">{pr('per_day')}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diskon Sewa Banyak */}
      <section className="py-10 bg-slate-50" id="diskon">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">{hs('diskon_title')}</h2>
          <p className="text-center text-slate-500 mb-6">{hs('diskon_desc')}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {config.volumeDiscounts.filter((d) => d.discount > 0).map((d, i) => (
              <div className="bg-white border-2 border-blue-600 rounded-lg py-4 px-6 text-center min-w-[140px]" key={i}>
                <div className="text-sm text-slate-500 mb-1">{d.minQty}-{d.maxQty > 100 ? '∞' : d.maxQty} unit</div>
                <div className="text-lg font-bold text-blue-600">{pr('save')} {d.discount * 100}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongkir */}
      <section className="py-10" id="ongkir">
        <div className="container">
          <h2 className="text-center text-xl md:text-2xl mb-2 font-bold text-slate-900">{hs('ongkir_title')}</h2>
          <p className="text-center text-slate-500 mb-6">{hs('ongkir_desc')}</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white max-w-[640px] mx-auto">
            <table className="w-full border-collapse text-sm text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{hs('table_distance')}</th>
                  <th className="p-3 px-4 font-semibold whitespace-nowrap border-b border-blue-600">{hs('table_fee')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {config.deliveryZones.map((zone, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-3 px-4 text-slate-800">≤ {zone.maxDistance} km</td>
                    <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">{zone.price === 0 ? pr('free') : formatPrice(zone.price)}</td>
                  </tr>
                ))}
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 px-4 text-slate-800">&gt; {config.deliveryZones[config.deliveryZones.length - 1].maxDistance} km</td>
                  <td className="p-3 px-4 font-bold text-blue-600 whitespace-nowrap">{formatPrice(config.deliveryPricePerKm)}{pr('per_km')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center mt-4 text-slate-500 text-sm">{hs('location_label')} {config.storeLocation.name} (Jl. Godean KM 10)</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-slate-50" id="faq-harga">
        <div className="container">
          <div className="max-w-[640px] mx-auto">
            <FAQAccordion items={faqItems} title={hs('faq_title')} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-[#1a4ea0] py-10 text-center text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl text-white mb-2 font-bold text-center">{hs('cta_title')}</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto text-center">{hs('cta_desc')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={localeHref("/#calculator", locale)} className="bg-white text-blue-600 max-w-[280px] w-full border-none py-3 px-6 rounded-md font-semibold hover:bg-slate-50 transition-colors text-center no-underline">
              {hs('cta_hitung')}
            </Link>
            <a
              href={getWhatsAppUrl('Halo Santi Living, saya mau tanya harga sewa kasur', 'harga_page')}
              className="max-w-[280px] w-full bg-transparent text-white border-2 border-white/50 no-underline py-3 px-6 rounded-md font-semibold hover:bg-white/15 hover:border-white transition-colors flex justify-center items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="harga_page"
              data-wa-location="harga_page"
            >
              {hs('cta_chat')}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
