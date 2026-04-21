'use client';

import { CalculatorProvider } from '@/contexts/CalculatorContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <CalculatorProvider>{children}</CalculatorProvider>;
}
