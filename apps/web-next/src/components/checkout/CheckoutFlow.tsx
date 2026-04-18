'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getOrder, setPaymentMethod } from '@/lib/checkout-session';
import { formatCurrency, formatDate } from '@/lib/format';
import { getAttributionEventParams } from '@/lib/attribution';
import type { OrderData, OrderPayloadItem } from '@/types/order';
import config from '@/data/config.json';
import Link from 'next/link';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    snap?: {
      pay: (token: string, options: Record<string, unknown>) => void;
      embed: (token: string, options: Record<string, unknown>) => void;
      hide: () => void;
    };
  }
}

type PaymentMethodType = 'bca' | 'gopay' | 'qris';

interface SnapTokenCache {
  token: string;
  paymentMethod: PaymentMethodType;
  createdAt: number;
}

const SNAP_TOKEN_CACHE_KEY = 'snapTokenCache';
const SNAP_TOKEN_MAX_AGE_MINUTES = 14; 
const BEGIN_CHECKOUT_TRACKED_KEY = 'sl_begin_checkout_tracked';

function getSnapTokenCache(publicToken: string, paymentMethod: PaymentMethodType): string | null {
  const cacheKey = `${SNAP_TOKEN_CACHE_KEY}_${publicToken}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const data: SnapTokenCache = JSON.parse(cached);
    if (data.paymentMethod !== paymentMethod) return null;
    const ageMinutes = (Date.now() - data.createdAt) / 1000 / 60;
    if (ageMinutes >= SNAP_TOKEN_MAX_AGE_MINUTES) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return data.token;
  } catch {
    return null;
  }
}

function setSnapTokenCache(publicToken: string, paymentMethod: PaymentMethodType, token: string): void {
  const cacheKey = `${SNAP_TOKEN_CACHE_KEY}_${publicToken}`;
  const data: SnapTokenCache = { token, paymentMethod, createdAt: Date.now() };
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
}

function clearSnapTokenCache(publicToken: string): void {
  const cacheKey = `${SNAP_TOKEN_CACHE_KEY}_${publicToken}`;
  sessionStorage.removeItem(cacheKey);
}

function fireGtagEvent(name: string, params: Record<string, unknown>): void {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

function trackBeginCheckout(order: OrderData, method: PaymentMethodType | null): void {
  if (sessionStorage.getItem(BEGIN_CHECKOUT_TRACKED_KEY) === '1') return;

  const attributionParams = getAttributionEventParams();
  fireGtagEvent('begin_checkout', {
    currency: 'IDR',
    value: order.totalPrice,
    payment_type: method ?? undefined,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      quantity: item.quantity,
      price: item.pricePerDay,
    })),
    ...attributionParams,
  });

  sessionStorage.setItem(BEGIN_CHECKOUT_TRACKED_KEY, '1');
}

function trackPurchase(order: OrderData, transactionId: string, currentMethod: PaymentMethodType | null): void {
  const attributionParams = getAttributionEventParams();
  fireGtagEvent('purchase', {
    transaction_id: transactionId,
    currency: 'IDR',
    value: order.totalPrice,
    payment_type: currentMethod ?? undefined,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      quantity: item.quantity,
      price: item.pricePerDay,
    })),
    ...attributionParams,
  });
}

export function CheckoutFlow() {
  const [isClient, setIsClient] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethodState] = useState<PaymentMethodType | null>(null);
  const [snapStatus, setSnapStatus] = useState<'loading' | 'error' | 'ready' | null>(null);
  const [snapError, setSnapError] = useState('');
  
  const snapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      const session = getOrder();
      if (!session) {
        window.location.href = '/#calculator';
        return;
      }
      sessionStorage.removeItem(BEGIN_CHECKOUT_TRACKED_KEY);
      setOrder(session.order);
      if (session.selectedPaymentMethod) {
        setSelectedMethodState(session.selectedPaymentMethod);
      }
    }, 0);
  }, []);

  const handleSelectMethod = (method: PaymentMethodType) => {
    setSelectedMethodState(method);
    setPaymentMethod(method);
    setStep(2);
    if (order) {
      trackBeginCheckout(order, method);
    }
    
    if (method === 'gopay' || method === 'qris') {
      initSnapPayment(method);
    }
  };

  const handleBack = () => {
    setStep(1);
    // Don't clear public token, we might just want to change method
  };

  const handleCopy = async (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(text);
      const btn = e.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const initSnapPayment = async (method: PaymentMethodType) => {
    setSnapStatus('loading');
    try {
      const publicToken = sessionStorage.getItem('erpPublicToken');
      if (!publicToken) throw new Error('Pesanan tidak ditemukan. Silakan kembali ke halaman utama.');

      const mappedMethod = method === 'gopay' ? 'gopay' : 'qris';
      const updateRes = await fetch('/api/update-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: publicToken, paymentMethod: mappedMethod }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error || 'Gagal mengupdate metode pembayaran.');

      let snapToken: string;
      const cachedToken = getSnapTokenCache(publicToken, method);

      if (cachedToken) {
        snapToken = cachedToken;
      } else {
        const tokenRes = await fetch('/api/create-payment-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: publicToken, paymentMethod: mappedMethod }),
        });
        if (!tokenRes.ok) throw new Error('Gagal mengambil token pembayaran.');
        const tokenData = await tokenRes.json();
        snapToken = tokenData.token;
        setSnapTokenCache(publicToken, method, snapToken);
      }

      const triggerSnap = () => {
        if (window.snap) {
          if (window.snap.hide) window.snap.hide();
          window.snap.embed(snapToken, {
            embedId: 'snap-container-inner',
            onSuccess: () => {
              clearSnapTokenCache(publicToken);
              if (order) trackPurchase(order, sessionStorage.getItem('erpOrderNumber') || publicToken, method);
              window.location.href = `/pesanan/${publicToken}`;
            },
            onPending: () => {
              // Usually handled internally or we can redirect to pesanan
            },
            onError: () => {
              setSnapStatus('error');
              setSnapError('Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: () => {
              setSnapStatus('error');
              setSnapError('Sesi pembayaran ditutup sebelum selesai.');
            }
          });
          setSnapStatus('ready');
        } else {
          setTimeout(triggerSnap, 500);
        }
      };

      triggerSnap();

      setTimeout(() => {
        if (snapContainerRef.current) {
          snapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error: unknown) {
      setSnapStatus('error');
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.';
      setSnapError(msg);
    }
  };

  const handleConfirmBca = () => {
    // For BCA manual transfer, just redirect to pesanan 
    const publicToken = sessionStorage.getItem('erpPublicToken');
    if (publicToken) {
       window.location.href = `/pesanan/${publicToken}`;
    } else {
       alert('Token pesanan tidak ditemukan');
    }
  };

  if (!isClient || !order) {
    return (
      <div className="loading-placeholder">
        <span className="loading-spinner"></span>
        <p>Memuat data pesanan...</p>
      </div>
    );
  }

  const subtotal = order.totalPrice - order.deliveryFee;
  const startDate = new Date(order.orderDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + order.duration - 1);
  const { payment } = config;

  return (
    <>
      <div className={`checkout-step ${step === 1 ? 'active' : ''}`}>
        <div className="checkout-grid">
          <div className="checkout-summary-container">
            <div className="checkout-summary">
              <h3 className="summary-title">Ringkasan Pesanan</h3>
              <div className="summary-section">
                <div className="summary-row">
                  <span className="summary-label">Nama</span>
                  <span className="summary-value">{order.customerName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">WhatsApp</span>
                  <span className="summary-value">{order.customerWhatsapp}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Alamat</span>
                  <span className="summary-value address">{order.deliveryAddress}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-section">
                <h4 className="summary-subtitle">Produk</h4>
                {order.items.map((item: OrderPayloadItem, i: number) => (
                  <div className="summary-item" key={i}>
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">{item.quantity}x</span>
                    </div>
                    <span className="item-price">
                      Rp {formatCurrency(item.pricePerDay * item.quantity * order.duration)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-section">
                <div className="summary-row">
                  <span className="summary-label">Durasi</span>
                  <span className="summary-value">{order.duration} hari</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tanggal</span>
                  <span className="summary-value">{formatDate(startDate)} - {formatDate(endDate)}</span>
                </div>
                {order.notes && (
                  <div className="summary-row notes-row">
                    <span className="summary-label">Catatan</span>
                    <span className="summary-value">{order.notes}</span>
                  </div>
                )}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-section summary-totals">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">Rp {formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Ongkir</span>
                  <span className="summary-value">Rp {formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">Rp {formatCurrency(order.totalPrice)}</span>
                </div>
              </div>

              <Link href="/cart" className="btn-edit-order">
                ✏️ Edit Pesanan
              </Link>
            </div>
          </div>

          <div className="checkout-payment-selection">
            <h3 className="section-title">Pilih Metode Pembayaran</h3>
            <div className="payment-options">
              <button
                type="button"
                className={`payment-option-btn ${selectedMethod === 'bca' ? 'selected' : ''}`}
                onClick={() => handleSelectMethod('bca')}
              >
                <Image src="/images/logo-bca.png" alt="BCA" width={64} height={20} className="option-logo" />
                <span className="option-label">Transfer BCA</span>
                <span className="option-desc">Manual transfer</span>
              </button>
              <button
                type="button"
                className={`payment-option-btn ${selectedMethod === 'gopay' ? 'selected' : ''}`}
                onClick={() => handleSelectMethod('gopay')}
              >
                <Image src="/images/logo-gopay.svg" alt="GoPay" width={64} height={14} className="option-logo" />
                <span className="option-label">GoPay</span>
                <span className="option-desc">Scan QR / Deeplink</span>
              </button>
              <button
                type="button"
                className={`payment-option-btn ${selectedMethod === 'qris' ? 'selected' : ''}`}
                onClick={() => handleSelectMethod('qris')}
              >
                <Image src="/images/logo-qris.svg" alt="QRIS" width={50} height={17} className="option-logo" />
                <span className="option-label">QRIS</span>
                <span className="option-desc">Semua e-wallet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`checkout-step ${step === 2 ? 'active' : ''}`}>
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Kembali
        </button>

        <div className="checkout-grid">
          {selectedMethod === 'bca' && (
            <div className="checkout-summary-mini">
              <div className="mini-summary">
                <div className="mini-row">
                  <span className="mini-label">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} item × {order.duration} hari
                  </span>
                </div>
                <div className="mini-row total">
                  <span className="mini-label">Total Bayar</span>
                  <span className="mini-value">Rp {formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          )}

          <div 
            className="checkout-payment-details" 
            ref={snapContainerRef}
            style={selectedMethod !== 'bca' ? { gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' } : {}}
          >
            {selectedMethod === 'bca' ? (
              <div className="payment-method-card">
                <div className="payment-header">
                  <span className="payment-icon">🏦</span>
                  <h4 className="payment-title">Transfer BCA</h4>
                </div>
                <div className="payment-details">
                  <div className="detail-row">
                    <span className="detail-label">Bank</span>
                    <span className="detail-value">{payment.bca.bank}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Nama Rekening</span>
                    <span className="detail-value">{payment.bca.accountName}</span>
                  </div>
                  <div className="detail-row with-copy">
                    <div className="detail-info">
                      <span className="detail-label">Nomor Rekening</span>
                      <span className="detail-value account-number">{payment.bca.accountNumber}</span>
                    </div>
                    <button type="button" className="copy-button" onClick={(e) => handleCopy(payment.bca.accountNumber, e)}>
                      <span className="copy-icon">📋</span> Copy
                    </button>
                  </div>
                  <div className="detail-row with-copy amount-row">
                    <div className="detail-info">
                      <span className="detail-label">Jumlah Transfer</span>
                      <span className="detail-value amount">Rp {formatCurrency(order.totalPrice)}</span>
                    </div>
                    <button type="button" className="copy-button" onClick={(e) => handleCopy(order.totalPrice.toString(), e)}>
                      <span className="copy-icon">📋</span> Copy
                    </button>
                  </div>
                </div>
                <div className="payment-note warning">
                  <p>⚠️ Transfer sesuai nominal di atas agar pembayaran dapat terverifikasi.</p>
                </div>
              </div>
            ) : (
              <div className="payment-method-card snap-wrapper" style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
              }}>
                <h4 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  margin: '0 0 var(--space-3)',
                  paddingBottom: 'var(--space-3)',
                  borderBottom: '1px solid var(--color-border)',
                  textAlign: 'center'
                }}>
                  {selectedMethod === 'gopay' ? '💚 Pembayaran GoPay' : '📱 Pembayaran QRIS'}
                </h4>
                
                {snapStatus === 'loading' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
                    <div className="loading-spinner" style={{ marginBottom: '1rem' }}></div>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Menyiapkan Pembayaran...</p>
                  </div>
                )}

                {snapStatus === 'error' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
                    <p style={{ color: '#ef4444', marginBottom: '20px' }}>{snapError}</p>
                    <button 
                      onClick={() => initSnapPayment(selectedMethod as PaymentMethodType)}
                      style={{ padding: '10px 20px', background: '#065f46', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}

                <div 
                  id="snap-container-inner" 
                  style={{
                    minHeight: snapStatus === 'ready' ? '650px' : '0',
                    display: snapStatus === 'ready' ? 'flex' : 'none',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {selectedMethod === 'bca' && (
          <div className="checkout-confirm-sticky">
            <button
              type="button"
              className="btn btn-whatsapp btn-lg btn-confirm"
              onClick={handleConfirmBca}
            >
              ✓ Saya Sudah Bayar
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .checkout-step {
          display: none;
        }
        .checkout-step.active {
          display: block;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .checkout-grid {
          display: grid;
          gap: var(--space-6);
          max-width: 900px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr 1fr; }
        }
        .section-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin-bottom: var(--space-4);
        }
        .checkout-payment-selection {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          border: 1px solid var(--color-border);
        }
        @media (max-width: 767px) {
          .checkout-payment-selection {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 50;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
            padding: var(--space-4) var(--space-5) 50px;
          }
          .checkout-step.active { padding-bottom: 200px; }
        }
        .payment-options {
          display: flex; flex-direction: column; gap: var(--space-3);
        }
        .payment-option-btn {
          display: flex; align-items: center; gap: var(--space-3);
          padding: var(--space-4);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          cursor: pointer; transition: all 0.2s;
          text-align: left; min-height: 72px;
        }
        .payment-option-btn:hover, .payment-option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }
        .option-logo { object-fit: contain; }
        .option-label { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--color-text); display: block; }
        .option-desc { font-size: var(--font-size-sm); color: var(--color-text-muted); }
        .btn-back {
          display: inline-flex; align-items: center; gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: transparent; border: none;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          cursor: pointer; margin-bottom: var(--space-4);
          min-height: 44px;
        }
        .btn-back:hover { color: var(--color-primary); }
        .checkout-summary-mini { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-4); border: 1px solid var(--color-border); }
        .btn-confirm {
          display: block; width: 100%; max-width: 400px;
          margin: var(--space-6) auto var(--space-8);
          padding: var(--space-4);
          font-size: var(--font-size-lg);
          background: var(--color-secondary); color: white;
          border: none; border-radius: var(--radius-lg);
          cursor: pointer; transition: all 0.2s; min-height: 56px;
        }
        @media (max-width: 767px) {
          .checkout-confirm-sticky {
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
            background: var(--color-surface); border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15); padding: var(--space-4) var(--space-5) 50px;
            border-top: 1px solid var(--color-border);
          }
          .checkout-step.active { padding-bottom: 140px; }
          #checkoutStep2 .btn-confirm { margin: 0; max-width: none; width: 100%; }
        }
        .checkout-summary { background: var(--color-surface); border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--color-border); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .summary-title { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-4); padding-bottom: var(--space-3); border-bottom: 2px solid var(--color-primary); display: flex; align-items: center; gap: var(--space-2); }
        .summary-title::before { content: "📋"; }
        .summary-section { margin-bottom: var(--space-3); }
        .summary-subtitle { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 var(--space-2); }
        .summary-row { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-2) 0; }
        .summary-label { font-size: var(--font-size-sm); color: var(--color-text-secondary); flex-shrink: 0; }
        .summary-value { font-size: var(--font-size-sm); color: var(--color-text); font-weight: var(--font-weight-medium); text-align: right; word-break: break-word; }
        .summary-row.notes-row { flex-direction: column; align-items: flex-start; gap: var(--space-1); margin-top: var(--space-2); padding: var(--space-2); background: var(--color-surface); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary-light); }
        .summary-row.notes-row .summary-value { font-style: italic; color: var(--color-text-secondary); text-align: left; }
        .summary-value.address { font-size: var(--font-size-xs); line-height: 1.5; max-width: 200px; }
        .summary-divider { height: 1px; background: var(--color-border); margin: var(--space-3) 0; }
        .summary-item { display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) var(--space-3); background: var(--color-background); border-radius: var(--radius-md); margin-bottom: var(--space-2); }
        .item-info { display: flex; align-items: center; gap: var(--space-2); }
        .item-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
        .item-qty { font-size: var(--font-size-xs); color: var(--color-text-muted); background: var(--color-primary-light); padding: 2px 8px; border-radius: var(--radius-full); }
        .item-price { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); }
        .summary-totals { background: var(--color-background); margin: 0 calc(var(--space-5) * -1); margin-bottom: calc(var(--space-5) * -1); padding: var(--space-4) var(--space-5); border-radius: 0 0 var(--radius-xl) var(--radius-xl); }
        .summary-row.total { padding-top: var(--space-3); margin-top: var(--space-2); border-top: 2px dashed var(--color-border); }
        .summary-row.total .summary-label { font-size: var(--font-size-base); font-weight: var(--font-weight-bold); }
        .summary-row.total .summary-value { font-size: var(--font-size-lg); color: var(--color-primary); font-weight: var(--font-weight-bold); }
        .btn-edit-order { display: flex; justify-content: center; align-items: center; gap: var(--space-2); padding: var(--space-3); margin-top: var(--space-4); background: transparent; border: 1px dashed var(--color-border); border-radius: var(--radius-md); color: var(--color-text-secondary); font-size: var(--font-size-sm); text-decoration: none; min-height: 44px; transition: all 0.2s; }
        .btn-edit-order:hover { background: var(--color-background); border-color: var(--color-primary); color: var(--color-primary); }
        
        .payment-method-card { background: var(--color-surface); border-radius: var(--radius-xl); padding: var(--space-5); border: 1px solid var(--color-border); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .payment-header { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 2px solid var(--color-primary); }
        .payment-title { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin: 0; }
        .payment-details { display: flex; flex-direction: column; gap: var(--space-3); }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) 0; }
        .detail-row.with-copy { background: var(--color-background); padding: var(--space-3); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2); }
        .detail-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .detail-label { font-size: var(--font-size-xs); color: var(--color-text-muted); }
        .detail-value { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
        .detail-value.account-number { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); font-family: monospace; letter-spacing: 0.05em; }
        .detail-value.amount { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-primary); }
        .copy-button { display: inline-flex; align-items: center; gap: var(--space-1); padding: var(--space-2) var(--space-3); background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); cursor: pointer; min-height: 36px; transition: all 0.2s; }
        .copy-button:hover { background: var(--color-primary-dark); }
        .copy-button.copied { background: var(--color-success); }
        .payment-note.warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; margin-top: var(--space-4); padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--font-size-sm); }
        .payment-note p { margin: 0; }

        .loading-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-8); color: var(--color-text-muted); text-align: center; }
        .loading-spinner { width: 32px; height: 32px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: var(--space-3); }
        @keyframes spin { to { transform: rotate(360deg); } }

        .mini-summary { padding: var(--space-2); }
        .mini-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-1) 0; }
        .mini-row.total { padding-top: var(--space-2); margin-top: var(--space-2); border-top: 1px solid var(--color-border); }
        .mini-label { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
        .mini-row.total .mini-label { font-weight: var(--font-weight-semibold); color: var(--color-text); }
        .mini-value { font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--color-primary); }

        #snap-container-inner iframe { width: 320px !important; min-width: 320px !important; min-height: 720px !important; }
        @media (max-width: 100%) { #snap-container-inner iframe { min-width: 320px !important; } }
      `}</style>
    </>
  );
}
