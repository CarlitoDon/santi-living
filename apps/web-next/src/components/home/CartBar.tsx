'use client';

import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { useRouter } from 'next/navigation';
import { usePresence } from '@/hooks/usePresence';
import { useState } from 'react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID').format(amount);

export function CartBar() {
  const { actions } = useCalculatorContext();
  const router = useRouter();
  const { state: cartState } = actions;

  const pricePerDay = cartState.items.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0,
  );
  const isVisible = cartState.totalQuantity > 0;
  const presence = usePresence(isVisible, 280);
  const [displayedSummary, setDisplayedSummary] = useState(() => ({
    quantity: cartState.totalQuantity,
    pricePerDay,
  }));

  if (
    isVisible &&
    (displayedSummary.quantity !== cartState.totalQuantity ||
      displayedSummary.pricePerDay !== pricePerDay)
  ) {
    setDisplayedSummary({ quantity: cartState.totalQuantity, pricePerDay });
  }

  const summary = isVisible
    ? { quantity: cartState.totalQuantity, pricePerDay }
    : displayedSummary;

  if (!presence.shouldRender) return null;

  return (
    <div className="cart-bar" data-state={presence.state} aria-hidden={!isVisible} inert={!isVisible}>
      <div className="cart-bar-inner">
        <div className="cart-bar-info">
          <span className="cart-bar-count">{summary.quantity} item</span>
          <span className="cart-bar-price">
            Rp{formatCurrency(summary.pricePerDay)}<span className="cart-bar-unit">/hari</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/pesan')}
          className="cart-bar-btn"
        >
          Lanjutkan →
        </button>
      </div>
    </div>
  );
}
