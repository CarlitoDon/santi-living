'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePresence } from '@/hooks/usePresence';

type SelectionBarProps = {
  isVisible: boolean;
  summaryKey: string;
  count: ReactNode;
  detail: ReactNode;
  detailClassName?: string;
  children: ReactNode;
};

/** Shared animated summary bar for selections that can be sent or continued. */
export function SelectionBar({
  isVisible,
  summaryKey,
  count,
  detail,
  detailClassName,
  children,
}: SelectionBarProps) {
  const presence = usePresence(isVisible, 280);
  const [displayedSummary, setDisplayedSummary] = useState(() => ({
    key: summaryKey,
    count,
    detail,
  }));

  if (isVisible && displayedSummary.key !== summaryKey) {
    setDisplayedSummary({ key: summaryKey, count, detail });
  }

  const summary = isVisible
    ? { count, detail }
    : { count: displayedSummary.count, detail: displayedSummary.detail };

  if (!presence.shouldRender) return null;

  return (
    <div
      className="cart-bar"
      data-state={presence.state}
      aria-hidden={!isVisible}
      inert={!isVisible}
    >
      <div className="cart-bar-inner">
        <div className="cart-bar-info">
          <span className="cart-bar-count">{summary.count}</span>
          <span className={`cart-bar-price${detailClassName ? ` ${detailClassName}` : ''}`}>
            {summary.detail}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
