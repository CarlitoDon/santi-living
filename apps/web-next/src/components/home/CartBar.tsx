'use client';

import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { useRouter } from 'next/navigation';
import { SelectionBar } from '@/components/ui/SelectionBar';

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

  return (
    <SelectionBar
      isVisible={isVisible}
      summaryKey={`${cartState.totalQuantity}:${pricePerDay}`}
      count={`${cartState.totalQuantity} item`}
      detail={<>Rp{formatCurrency(pricePerDay)}<span className="cart-bar-unit">/hari</span></>}
    >
      <button
        type="button"
        onClick={() => router.push('/pesan')}
        className="cart-bar-btn"
      >
        Lanjutkan →
      </button>
    </SelectionBar>
  );
}
