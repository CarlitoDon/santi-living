'use client';

import { useState, useCallback } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { createOrderInERP } from '@/services/erp-api';
import { saveOrder } from '@/scripts/checkout-session';
import { showAlert } from '@/utils/alert';

interface StepReviewProps {
  setErrors: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  onBack: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID').format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export function StepReview({ setErrors, onBack }: StepReviewProps) {
  const { actions, customer } = useCalculatorContext();
  const { state } = actions;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    // Final validation
    const validationErrors: Record<string, string> = {};
    if (state.totalQuantity === 0) validationErrors.items = 'Pilih minimal 1 item';
    if (!state.startDate) validationErrors.startDate = 'Tanggal mulai wajib diisi';
    if (!customer.name.trim()) validationErrors.customerName = 'Nama wajib diisi';
    if (!customer.whatsapp.trim()) validationErrors.customerWhatsapp = 'No. WhatsApp wajib diisi';
    if (!customer.address.street.trim()) validationErrors.addressStreet = 'Alamat wajib diisi';
    if (!customer.address.lat || !customer.address.lng) validationErrors.addressLocation = 'Lokasi belum dipilih';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(() => validationErrors);
      showAlert('Ada data yang belum lengkap. Silakan kembali ke langkah sebelumnya.', 'Data Belum Lengkap', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build full address
      let fullAddress = customer.address.street;
      if (customer.address.kelurahan) fullAddress += `, ${customer.address.kelurahan}`;
      if (customer.address.kecamatan) fullAddress += `, ${customer.address.kecamatan}`;
      if (customer.address.kota) fullAddress += `, ${customer.address.kota}`;
      if (customer.address.provinsi) fullAddress += `, ${customer.address.provinsi}`;
      if (customer.address.zip) fullAddress += ` ${customer.address.zip}`;
      if (customer.address.lat && customer.address.lng) {
        fullAddress += ` (${customer.address.lat}, ${customer.address.lng})`;
      }

      const orderId = `SL-${Date.now().toString(36).toUpperCase()}`;

      const bookingData = {
        orderId,
        customerName: customer.name,
        customerWhatsapp: customer.whatsapp,
        deliveryAddress: fullAddress,
        addressFields: customer.address,
        items: state.items.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          pricePerDay: item.pricePerDay,
          includes: item.includes,
        })),
        totalPrice: state.total,
        orderDate: state.startDate || '',
        endDate: state.endDate || '',
        duration: state.duration,
        deliveryFee: state.deliveryFee || 0,
        paymentMethod: state.paymentMethod,
        notes: customer.notes,
        volumeDiscountAmount: state.volumeDiscountAmount,
        volumeDiscountLabel: state.volumeDiscountLabel,
      };

      saveOrder(bookingData);

      const erpResponse = await createOrderInERP(bookingData);
      if (erpResponse.orderUrl) {
        sessionStorage.setItem('erpOrderUrl', erpResponse.orderUrl);
        sessionStorage.setItem('erpOrderNumber', erpResponse.orderNumber);
        sessionStorage.setItem('erpPublicToken', erpResponse.publicToken);
      }

      window.location.href = '/checkout';
    } catch (error) {
      console.error('Failed to submit order:', error);
      showAlert(
        `Mohon maaf, terjadi kesalahan: ${(error as Error).message || 'Gagal memproses pesanan'}. Silakan coba lagi.`,
        'Pemesanan Gagal',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [state, customer, setErrors]);

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">📋 Review Pesanan</h2>
      <p className="wizard-step-subtitle">Pastikan semua data sudah benar</p>

      {/* Items */}
      <div className="review-card">
        <h3 className="review-card-title">Item Pesanan</h3>
        {state.items.map((item) => {
          const lineTotal = item.quantity * item.pricePerDay * state.duration;
          return (
            <div key={item.id} className="review-item">
              <div className="review-item-top">
                <span className="review-item-name">{item.name}</span>
                <span className="review-item-total">Rp{formatCurrency(lineTotal)}</span>
              </div>
              <div className="review-item-detail">
                {item.quantity} unit × Rp{formatCurrency(item.pricePerDay)}/hari × {state.duration} hari
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule */}
      <div className="review-card">
        <h3 className="review-card-title">Jadwal</h3>
        <div className="review-row">
          <span>Tanggal Mulai</span>
          <span>{formatDate(state.startDate)}</span>
        </div>
        <div className="review-row">
          <span>Tanggal Selesai</span>
          <span>{formatDate(state.endDate)}</span>
        </div>
        <div className="review-row">
          <span>Durasi</span>
          <span>{state.duration} hari</span>
        </div>
      </div>

      {/* Customer */}
      <div className="review-card">
        <h3 className="review-card-title">Pemesan</h3>
        <div className="review-row">
          <span>Nama</span>
          <span>{customer.name || '-'}</span>
        </div>
        <div className="review-row">
          <span>WhatsApp</span>
          <span>{customer.whatsapp || '-'}</span>
        </div>
      </div>

      {/* Address */}
      <div className="review-card">
        <h3 className="review-card-title">Alamat</h3>
        <p className="review-address">
          {customer.address.street}
          {customer.address.kelurahan && `, ${customer.address.kelurahan}`}
          {customer.address.kecamatan && `, ${customer.address.kecamatan}`}
          {customer.address.kota && `, ${customer.address.kota}`}
        </p>
        {customer.notes && (
          <p className="review-notes">📝 {customer.notes}</p>
        )}
      </div>

      {/* Totals */}
      <div className="review-card review-totals">
        {state.deliveryFee > 0 && (
          <div className="review-row">
            <span>Biaya Antar</span>
            <span>Rp{formatCurrency(state.deliveryFee)}</span>
          </div>
        )}
        {state.volumeDiscountAmount > 0 && (
          <div className="review-row review-discount">
            <span>Diskon {state.volumeDiscountLabel && `(${state.volumeDiscountLabel})`}</span>
            <span>−Rp{formatCurrency(state.volumeDiscountAmount)}</span>
          </div>
        )}
        {state.durationDiscountAmount > 0 && (
          <div className="review-row review-discount">
            <span>Diskon Durasi ({state.durationDiscountPercent}%)</span>
            <span>−Rp{formatCurrency(state.durationDiscountAmount)}</span>
          </div>
        )}
        <div className="review-total-row">
          <span>Total</span>
          <span>Rp{formatCurrency(state.total)}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="wizard-btn-row">
        <button type="button" onClick={onBack} className="wizard-back-btn-bottom">
          ← Kembali
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="wizard-submit-btn"
        >
          {isSubmitting ? (
            'Memproses...'
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pesan via WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  );
}
