'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useRef } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { getWhatsAppUrl } from '@/utils/whatsapp';

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
  onClose: () => void;
};

export function ServiceInquiryModal({
  item,
  serviceLabel,
  inquiryMessage,
  source,
  onClose,
}: ServiceInquiryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = Boolean(item);

  useDialogFocus({ isOpen, onClose, containerRef: dialogRef, initialFocusRef: closeButtonRef });
  useBodyScrollLock(isOpen);

  if (!item || typeof document === 'undefined') return null;

  const message = inquiryMessage.replace('{jenis}', item.name);

  return createPortal(
    <div
      className="product-modal-backdrop fixed inset-0 z-[2000] flex items-end justify-center bg-black/55 backdrop-blur-sm md:items-center md:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="product-modal-panel relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
        style={{ maxHeight: '90dvh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-inquiry-modal-title"
        aria-describedby="service-inquiry-modal-description"
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="absolute right-4 top-4 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
          onClick={onClose}
          aria-label="Tutup"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="grid flex-1 overflow-y-auto overscroll-contain md:grid-cols-2">
          <div className="min-h-[250px] bg-slate-50 md:border-r md:border-slate-200">
            <Image
              src={item.image}
              alt={item.imageAlt}
              width={900}
              height={900}
              priority
              sizes="(max-width: 767px) 100vw, 450px"
              className="h-full max-h-[400px] w-full object-cover md:max-h-none"
            />
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">Sewa {serviceLabel.toLowerCase()}</p>
            <h2 id="service-inquiry-modal-title" className="mb-4 text-xl font-bold leading-snug text-slate-900">{item.name}</h2>
            <div id="service-inquiry-modal-description" className="border-b border-slate-200 pb-5 text-[0.95rem] leading-[1.6] text-slate-700">
              <p>{item.description}</p>
            </div>
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="mb-2 text-[0.95rem] font-semibold text-emerald-800">Yang perlu disiapkan</h3>
              <ul className="m-0 list-none space-y-1 p-0">
                {item.facts.map((fact) => (
                  <li key={fact} className="relative pl-6 text-emerald-700">
                    <span className="absolute left-0 font-bold text-emerald-600">✓</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <a
            href={getWhatsAppUrl(message, source)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex h-12 w-full items-center justify-center rounded-lg text-lg shadow-[0_10px_15px_-3px_rgba(37,99,235,0.4)]"
          >
            Cek ketersediaan
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
