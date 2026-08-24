'use client';

import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const activeDialogStack: symbol[] = [];

interface DialogFocusOptions {
  isOpen: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/** Keeps keyboard focus inside an active overlay and restores it on close. */
export function useDialogFocus({
  isOpen,
  onClose,
  containerRef,
  initialFocusRef,
}: DialogFocusOptions) {
  const onCloseRef = useRef(onClose);
  const dialogTokenRef = useRef(Symbol('dialog-focus'));

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialogToken = dialogTokenRef.current;
    activeDialogStack.push(dialogToken);

    const focusFrame = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      const target =
        initialFocusRef?.current ??
        container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
        container;
      target?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeDialogStack.at(-1) !== dialogToken) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          !element.hasAttribute('disabled') &&
          element.getAttribute('aria-hidden') !== 'true' &&
          element.getClientRects().length > 0,
      );

      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      const wasTopDialog = activeDialogStack.at(-1) === dialogToken;
      const stackIndex = activeDialogStack.lastIndexOf(dialogToken);
      if (stackIndex !== -1) activeDialogStack.splice(stackIndex, 1);

      if (wasTopDialog && previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [containerRef, initialFocusRef, isOpen]);
}
