'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ModalShell } from '@/components/ui/ModalShell';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';

export type ServiceInquiryItem = {
  name: string;
  image: string;
  imageAlt: string;
  description: string;
  facts: string[];
};

type ServiceInquiryModalProps = {
  item: ServiceInquiryItem | null;
  serviceLabel: string;
  inquiryMessage: string;
  source: string;
  productCategory: string;
  pageType: string;
  intent: string;
  onClose: () => void;
};

export function ServiceInquiryModal({
  item,
  serviceLabel,
  inquiryMessage,
  source,
  productCategory,
  pageType,
  intent,
  onClose,
}: ServiceInquiryModalProps) {
  const isOpen = Boolean(item);
  const [displayedItem, setDisplayedItem] = useState<ServiceInquiryItem | null>(item);

  if (item && item !== displayedItem) {
    setDisplayedItem(item);
  }

  const activeItem = item ?? displayedItem;
  if (!activeItem) return null;

  const message = inquiryMessage.replace('{jenis}', activeItem.name);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId="service-inquiry-modal-title"
      descriptionId="service-inquiry-modal-description"
      closeLabel="Tutup"
      bodyClassName="grid flex-1 overflow-y-auto overscroll-contain md:grid-cols-2"
      footer={(
        <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <WhatsAppLink
            message={message}
            source={source}
            location="service_inquiry_modal"
            data-product-category={productCategory}
            data-page-type={pageType}
            data-wa-intent={intent}
            className="btn btn-primary flex h-12 w-full items-center justify-center rounded-lg text-lg shadow-[0_10px_15px_-3px_rgba(37,99,235,0.4)]"
          >
            Cek ketersediaan
          </WhatsAppLink>
        </div>
      )}
    >
      <div className="min-h-[250px] bg-slate-50 md:border-r md:border-slate-200">
        <Image
          src={activeItem.image}
          alt={activeItem.imageAlt}
          width={900}
          height={900}
          priority
          sizes="(max-width: 767px) 100vw, 450px"
          className="h-full max-h-[400px] w-full object-cover md:max-h-none"
        />
      </div>
      <div className="flex flex-col p-6 md:p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">Sewa {serviceLabel.toLowerCase()}</p>
        <h2 id="service-inquiry-modal-title" className="mb-4 text-xl font-bold leading-snug text-slate-900">{activeItem.name}</h2>
        <div id="service-inquiry-modal-description" className="border-b border-slate-200 pb-5 text-[0.95rem] leading-[1.6] text-slate-700">
          <p>{activeItem.description}</p>
        </div>
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="mb-2 text-[0.95rem] font-semibold text-emerald-800">Yang perlu disiapkan</h3>
          <ul className="m-0 list-none space-y-1 p-0">
            {activeItem.facts.map((fact) => (
              <li key={fact} className="relative pl-6 text-emerald-700">
                <span className="absolute left-0 font-bold text-emerald-600">✓</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ModalShell>
  );
}
