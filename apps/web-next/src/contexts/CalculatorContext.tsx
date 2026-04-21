'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useCalculatorState, type CalculatorActions } from '@/components/calculator/useCalculatorState';
import type { CustomerData } from '@/components/calculator/types';
import { useState, useCallback, useEffect } from 'react';

const initialCustomer: CustomerData = {
  name: '',
  whatsapp: '',
  address: {
    street: '',
    kelurahan: '',
    kelurahanKode: '',
    kecamatan: '',
    kecamatanKode: '',
    kota: '',
    kotaKode: '',
    provinsi: 'Daerah Istimewa Yogyakarta',
    provinsiKode: '34',
    zip: '',
    lat: '',
    lng: '',
  },
  notes: '',
};

interface CalculatorContextValue {
  actions: CalculatorActions;
  customer: CustomerData;
  setCustomer: (updates: Partial<CustomerData>) => void;
  resetCustomer: () => void;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const actions = useCalculatorState();

  // Lazy initializer: hydrate customer from sessionStorage on first render
  const [customer, setCustomerState] = useState<CustomerData>(() => {
    if (typeof window === 'undefined') return initialCustomer;
    try {
      const draft = sessionStorage.getItem('santi-living-draft-customer');
      if (draft) {
        const parsed: unknown = JSON.parse(draft);
        if (parsed && typeof parsed === 'object') {
          return { ...initialCustomer, ...(parsed as Partial<CustomerData>) };
        }
      }
    } catch (e) {
      console.warn('Failed to parse customer draft', e);
    }
    return initialCustomer;
  });

  // Persist customer to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem('santi-living-draft-customer', JSON.stringify(customer));
  }, [customer]);

  const setCustomer = useCallback((updates: Partial<CustomerData>) => {
    setCustomerState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetCustomer = useCallback(() => {
    setCustomerState(initialCustomer);
  }, []);

  return (
    <CalculatorContext.Provider value={{ actions, customer, setCustomer, resetCustomer }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorContext(): CalculatorContextValue {
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider');
  }
  return ctx;
}
