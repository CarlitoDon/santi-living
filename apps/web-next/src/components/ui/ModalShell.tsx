'use client';

import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { usePresence } from '@/hooks/usePresence';

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId?: string;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  panelClassName?: string;
  panelStyle?: CSSProperties;
};

const CLOSE_BUTTON_CLASS =
  'absolute right-4 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white';

/** Shared accessible shell for product and service detail dialogs. */
export function ModalShell({
  isOpen,
  onClose,
  titleId,
  descriptionId,
  closeLabel,
  children,
  footer,
  bodyClassName = 'flex-1 overflow-y-auto overscroll-contain',
  panelClassName = 'product-modal-panel relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl md:rounded-2xl',
  panelStyle,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const presence = usePresence(isOpen, 280);

  useDialogFocus({
    isOpen,
    onClose,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
  });
  useBodyScrollLock(presence.shouldRender);

  useEffect(() => {
    if (!presence.shouldRender) return;

    const handleTouchMove = (event: TouchEvent) => {
      const scrollBody = scrollBodyRef.current;
      if (!scrollBody) return;

      if (!scrollBody.contains(event.target as Node)) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, [presence.shouldRender]);

  if (!presence.shouldRender || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="product-modal-backdrop fixed inset-0 z-[2000] flex items-end justify-center bg-black/55 backdrop-blur-sm md:items-center md:p-4"
      data-state={presence.state}
      aria-hidden={!isOpen}
      inert={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={panelClassName}
        style={{ maxHeight: '90dvh', ...panelStyle }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={CLOSE_BUTTON_CLASS}
          style={{ top: 'max(1rem, env(safe-area-inset-top, 0.75rem))' }}
          onClick={onClose}
          aria-label={closeLabel}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div ref={scrollBodyRef} className={bodyClassName}>
          {children}
        </div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}
