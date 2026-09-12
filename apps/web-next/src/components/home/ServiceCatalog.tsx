'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ProductPicker } from '@/components/home/ProductPicker';
import { CatalogItemCard } from '@/components/home/CatalogItemCard';
import { ServiceInquiryModal, type ServiceInquiryItem } from '@/components/home/ServiceInquiryModal';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import type { Locale } from '@/locales/dictionary';

type ServiceKey = 'kasur' | 'kursi' | 'karpet';

type ServiceCatalogItem = ServiceInquiryItem;

function getServiceIntent(service: ServiceKey, itemName?: string): string {
  if (service === 'kasur') return 'sewa_kasur';
  if (service === 'kursi') return 'sewa_kursi_acara';

  const normalizedItemName = itemName?.toLowerCase() ?? '';
  if (normalizedItemName.includes('merah')) return 'sewa_karpet_permadani_merah';
  if (normalizedItemName.includes('emas') || normalizedItemName.includes('cream')) {
    return 'sewa_karpet_permadani_emas';
  }
  return 'sewa_karpet_jogja';
}

const serviceOptions: Record<ServiceKey, {
  label: string;
  title: string;
  description: string;
  items: ServiceCatalogItem[];
  href: string;
  wa: string;
}> = {
  kasur: {
    label: 'Kasur',
    title: 'Katalog sewa kasur',
    description: 'Pilih ukuran kasur dan kebutuhan tambahan, lalu masukkan ke pesanan.',
    items: [],
    href: '/harga-sewa-kasur',
    wa: '',
  },
  kursi: {
    label: 'Kursi',
    title: 'Pilihan sewa kursi acara',
    description: 'Pilih jenis kursi untuk acara, lalu tim kami cek jumlah, tanggal, dan pengantaran.',
    items: [
      { name: 'Kursi lipat', image: '/images/kursi-lipat-merah.webp', imageAlt: 'Kursi lipat merah dengan rangka besi krom', description: 'Kursi lipat berlapis spons warna merah yang praktis untuk penataan acara yang fleksibel.', facts: ['Jumlah kursi yang dibutuhkan', 'Tanggal dan durasi acara', 'Lokasi pengantaran'] },
      { name: 'Kursi susun besi spons', image: '/images/kursi-susun-merah.webp', imageAlt: 'Kursi susun merah berlapis spons dengan rangka krom', description: 'Kursi susun dengan rangka krom serta dudukan dan sandaran spons merah untuk area tamu.', facts: ['Jumlah kursi yang dibutuhkan', 'Tanggal dan durasi acara', 'Lokasi pengantaran'] },
      { name: 'Kursi plastik', image: '/images/kursi-plastik-biru.webp', imageAlt: 'Kursi plastik biru model Napolly dengan sandaran berpalang', description: 'Kursi plastik biru model Napolly yang praktis untuk kebutuhan acara.', facts: ['Jumlah kursi yang dibutuhkan', 'Tanggal dan durasi acara', 'Lokasi pengantaran'] },
    ],
    href: '/sewa-kursi-acara',
    wa: 'Halo Santi Living, saya ingin cek sewa kursi acara.\n\nJenis kursi: {jenis}\nJumlah kursi: {jumlah}\nTanggal acara: {tanggal}\nLokasi: {alamat}\n\nMohon bantu cek ketersediaan dan pengantaran. Terima kasih.',
  },
  karpet: {
    label: 'Karpet',
    title: 'Pilihan sewa karpet acara',
    description: 'Tentukan kebutuhan area acara; admin membantu cek jenis, ukuran, dan estimasinya.',
    items: [
      { name: 'Permadani emas/cream', image: '/images/permadani-emas-cream.webp', imageAlt: 'Permadani besar motif klasik warna emas dan cream', description: 'Permadani besar motif klasik warna emas dan cream untuk area acara yang terasa hangat dan rapi.', facts: ['Ukuran area yang akan ditutup', 'Tanggal dan durasi acara', 'Lokasi pengantaran'] },
      { name: 'Permadani merah', image: '/images/permadani-merah.webp', imageAlt: 'Permadani besar motif klasik warna merah dan emas', description: 'Permadani besar motif klasik warna merah dan emas untuk menegaskan area utama acara.', facts: ['Ukuran area yang akan ditutup', 'Tanggal dan durasi acara', 'Lokasi pengantaran'] },
      { name: 'Permadani hijau', image: '/images/permadani-hijau.webp', imageAlt: 'Permadani besar motif klasik warna hijau dan emas', description: 'Permadani besar motif klasik warna hijau dan emas untuk penataan area acara.', facts: ['Ukuran area yang akan ditutup', 'Tanggal dan durasi acara', 'Lokasi pengantaran'] },
    ],
    href: '/sewa-karpet-jogja',
    wa: 'Halo Santi Living, saya ingin cek sewa karpet acara.\n\nJenis karpet: {jenis}\nUkuran area: {panjang x lebar}\nTanggal acara: {tanggal}\nLokasi: {alamat}\n\nMohon bantu cek ketersediaan dan pengantaran. Terima kasih.',
  },
};

export function ServiceCatalog({ initialService, locale }: { initialService: ServiceKey; locale: Locale }) {
  const [activeService, setActiveService] = useState<ServiceKey>(initialService);
  const [modalItem, setModalItem] = useState<ServiceCatalogItem | null>(null);
  const active = serviceOptions[activeService];

  return (
    <div className="service-catalog">
      <div className="service-catalog-tabs" role="tablist" aria-label="Pilih layanan sewa">
        {(Object.keys(serviceOptions) as ServiceKey[]).map((service) => (
          <button
            key={service}
            type="button"
            role="tab"
            aria-selected={activeService === service}
            className="service-catalog-tab"
            onClick={() => {
              setActiveService(service);
              setModalItem(null);
            }}
          >
            {serviceOptions[service].label}
          </button>
        ))}
      </div>

      <div className="service-catalog-intro">
        <p className="section-eyebrow">Sewa {active.label.toLowerCase()}</p>
        <h2 id="catalog-title">{active.title}</h2>
        <p>{active.description}</p>
      </div>

      {activeService === 'kasur' ? (
        <ProductPicker />
      ) : (
        <div className="product-picker service-request-panel">
          <section className="product-picker-category">
            <h3 className="product-picker-category-title">
              Pilihan {active.label.toLowerCase()}
              <span>{active.items.length} pilihan</span>
            </h3>
            <div className="product-picker-grid">
              {active.items.map((item) => (
                <div className="product-picker-card-wrap" key={item.name}>
                  <CatalogItemCard
                    title={item.name}
                    meta="Ketersediaan sesuai tanggal dan lokasi acara"
                    price={<>Cek ketersediaan<span>via WhatsApp</span></>}
                    thumbnail={<Image src={item.image} alt="" width={80} height={80} className="object-cover" />}
                    thumbnailAlt={item.imageAlt}
                    onDetail={() => setModalItem(item)}
                    action={
                      <WhatsAppLink
                        message={active.wa.replace('{jenis}', item.name)}
                        source={'homepage_' + activeService + '_' + item.name.toLowerCase().replaceAll(' ', '-')}
                        location="catalog_item"
                        data-product-category={activeService}
                        data-page-type="homepage"
                        data-wa-intent={getServiceIntent(activeService, item.name)}
                        className="stepper-btn-single"
                      >
                        Pilih
                      </WhatsAppLink>
                    }
                  />
                </div>
              ))}
            </div>
          </section>
          <div className="service-request-actions">
            <Link href={'/' + locale + active.href} className="home-primary-button">
              Lihat detail {active.label.toLowerCase()}
            </Link>
            <WhatsAppLink
              message={active.wa}
              source={'homepage_' + activeService + '_catalog'}
              location="catalog"
              data-product-category={activeService}
              data-page-type="homepage"
              data-wa-intent={getServiceIntent(activeService)}
              className="home-secondary-button"
            >
              Cek ketersediaan
            </WhatsAppLink>
          </div>
          <ServiceInquiryModal
            item={modalItem}
            serviceLabel={active.label}
            inquiryMessage={active.wa}
            source={'homepage_' + activeService + '_detail'}
            productCategory={activeService}
            pageType="homepage"
            intent={getServiceIntent(activeService, modalItem?.name)}
            onClose={() => setModalItem(null)}
          />
        </div>
      )}
    </div>
  );
}
