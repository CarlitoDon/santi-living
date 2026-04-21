'use client';

import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { useRouter } from 'next/navigation';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID').format(amount);

export function CartBar() {
  const { actions } = useCalculatorContext();
  const router = useRouter();
  const { state } = actions;

  if (state.totalQuantity === 0) return null;

  const pricePerDay = state.items.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0,
  );

  return (
    <div className="cart-bar">
      <div className="cart-bar-inner">
        <div className="cart-bar-info">
          <span className="cart-bar-count">{state.totalQuantity} item</span>
          <span className="cart-bar-price">
            Rp{formatCurrency(pricePerDay)}<span className="cart-bar-unit">/hari</span>
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
