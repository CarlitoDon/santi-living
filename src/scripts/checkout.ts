/**
 * Checkout Page Logic
 * Handles multi-step checkout UI, payment method selection, and confirmation
 */

import {
  getOrder,
  setPaymentMethod,
  getPaymentMethod,
  clearOrder,
} from "./checkout-session";
import config from "@/data/config.json";

// Types
type PaymentMethod = "bca" | "qris";

interface CheckoutState {
  step: 1 | 2;
  selectedMethod: PaymentMethod | null;
}

// State
let state: CheckoutState = {
  step: 1,
  selectedMethod: null,
};

// DOM Elements
let elements: Record<string, HTMLElement | null> = {};

/**
 * Initialize checkout page
 */
export function initCheckout(): void {
  // Check if we have order data
  const session = getOrder();

  if (!session) {
    // No order data - redirect to calculator
    window.location.href = "/sewa-kasur/#calculator";
    return;
  }

  // Cache DOM elements
  elements = {
    step1: document.getElementById("checkoutStep1"),
    step2: document.getElementById("checkoutStep2"),
    summaryContainer: document.getElementById("summaryContainer"),
    summaryMiniContainer: document.getElementById("summaryMiniContainer"),
    paymentDetailsContainer: document.getElementById("paymentDetailsContainer"),
    btnBack: document.getElementById("btnBack"),
    btnConfirmPayment: document.getElementById("btnConfirmPayment"),
  };

  // Render order summary
  renderSummary(session.order);

  // Check if payment method was already selected (browser back)
  if (session.selectedPaymentMethod) {
    state.selectedMethod = session.selectedPaymentMethod;
  }

  // Bind events
  bindEvents();
}

/**
 * Render order summary
 */
function renderSummary(order: any): void {
  const container = elements.summaryContainer;
  if (!container) return;

  // Calculate values
  const subtotal = order.totalPrice - order.deliveryFee;
  const startDate = new Date(order.orderDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + order.duration - 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  // Build items HTML
  const itemsHtml = order.items
    .map(
      (item: any) => `
      <div class="summary-item">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-qty">${item.quantity}x</span>
        </div>
        <span class="item-price">Rp ${formatCurrency(
          item.pricePerDay * item.quantity * order.duration
        )}</span>
      </div>
    `
    )
    .join("");

  container.innerHTML = `
    <div class="checkout-summary">
      <h3 class="summary-title">Ringkasan Pesanan</h3>

      <div class="summary-section">
        <div class="summary-row">
          <span class="summary-label">Nama</span>
          <span class="summary-value">${order.customerName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">WhatsApp</span>
          <span class="summary-value">${order.customerWhatsapp}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Alamat</span>
          <span class="summary-value address">${order.deliveryAddress}</span>
        </div>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-section">
        <h4 class="summary-subtitle">Produk</h4>
        ${itemsHtml}
      </div>

      <div class="summary-divider"></div>

      <div class="summary-section">
        <div class="summary-row">
          <span class="summary-label">Durasi</span>
          <span class="summary-value">${order.duration} hari</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Tanggal</span>
          <span class="summary-value">${formatDate(startDate)} - ${formatDate(
    endDate
  )}</span>
        </div>
        ${
          order.notes
            ? `
          <div class="summary-row notes-row">
            <span class="summary-label">Catatan</span>
            <span class="summary-value">${order.notes}</span>
          </div>
        `
            : ""
        }
      </div>

      <div class="summary-divider"></div>

      <div class="summary-section summary-totals">
        <div class="summary-row">
          <span class="summary-label">Subtotal</span>
          <span class="summary-value">Rp ${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Ongkir</span>
          <span class="summary-value">Rp ${formatCurrency(
            order.deliveryFee
          )}</span>
        </div>
        <div class="summary-row total">
          <span class="summary-label">Total</span>
          <span class="summary-value">Rp ${formatCurrency(
            order.totalPrice
          )}</span>
        </div>
      </div>

      <a href="/sewa-kasur/cart" class="btn-edit-order">
        ✏️ Edit Pesanan
      </a>
    </div>
  `;

  // Also render mini summary for step 2
  renderMiniSummary(order);
}

/**
 * Render mini summary for step 2
 */
function renderMiniSummary(order: any): void {
  const container = elements.summaryMiniContainer;
  if (!container) return;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const itemCount = order.items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  container.innerHTML = `
    <div class="mini-summary">
      <div class="mini-row">
        <span class="mini-label">${itemCount} item × ${
    order.duration
  } hari</span>
      </div>
      <div class="mini-row total">
        <span class="mini-label">Total Bayar</span>
        <span class="mini-value">Rp ${formatCurrency(order.totalPrice)}</span>
      </div>
    </div>
  `;
}

/**
 * Bind event listeners
 */
function bindEvents(): void {
  // Payment method selection
  document
    .querySelectorAll<HTMLButtonElement>(".payment-option-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const method = btn.dataset.method as PaymentMethod;
        selectPaymentMethod(method);
      });
    });

  // Back button
  elements.btnBack?.addEventListener("click", goToStep1);

  // Confirm payment button
  elements.btnConfirmPayment?.addEventListener("click", confirmPayment);
}

/**
 * Select payment method and go to step 2
 */
function selectPaymentMethod(method: PaymentMethod): void {
  state.selectedMethod = method;
  setPaymentMethod(method);

  // Update UI - mark selected
  document.querySelectorAll(".payment-option-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  document
    .querySelector(`[data-method="${method}"]`)
    ?.classList.add("selected");

  // Render payment details
  renderPaymentDetails(method);

  // Go to step 2
  goToStep2();
}

/**
 * Render payment details based on selected method
 */
function renderPaymentDetails(method: PaymentMethod): void {
  const container = elements.paymentDetailsContainer;
  if (!container) return;

  const session = getOrder();
  if (!session) return;

  const amount = session.order.totalPrice;
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);
  const { payment } = config;

  if (method === "bca") {
    container.innerHTML = `
      <div class="payment-method-card payment-bca">
        <div class="payment-header">
          <span class="payment-icon">🏦</span>
          <h4 class="payment-title">Transfer BCA</h4>
        </div>

        <div class="payment-details">
          <div class="detail-row">
            <span class="detail-label">Bank</span>
            <span class="detail-value">${payment.bca.bank}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Nama Rekening</span>
            <span class="detail-value">${payment.bca.accountName}</span>
          </div>
          
          <div class="detail-row with-copy">
            <div class="detail-info">
              <span class="detail-label">Nomor Rekening</span>
              <span class="detail-value account-number">${
                payment.bca.accountNumber
              }</span>
            </div>
            <button type="button" class="copy-button" data-copy-value="${
              payment.bca.accountNumber
            }">
              <span class="copy-icon">📋</span> Copy
            </button>
          </div>
          
          <div class="detail-row with-copy amount-row">
            <div class="detail-info">
              <span class="detail-label">Jumlah Transfer</span>
              <span class="detail-value amount">Rp ${formatCurrency(
                amount
              )}</span>
            </div>
            <button type="button" class="copy-button" data-copy-value="${amount}">
              <span class="copy-icon">📋</span> Copy
            </button>
          </div>
        </div>

        <div class="payment-note warning">
          <p>⚠️ Transfer sesuai nominal di atas agar pembayaran dapat terverifikasi.</p>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="payment-method-card payment-qris">
        <div class="payment-header">
          <span class="payment-icon">📱</span>
          <h4 class="payment-title">QRIS</h4>
        </div>

        <div class="payment-details">
          <div class="qris-image-container">
            <img src="${payment.qris.imagePath}" alt="QRIS ${
      payment.qris.merchantName
    }" class="qris-image" />
            <p class="merchant-name">${payment.qris.merchantName}</p>
          </div>

          <div class="detail-row with-copy amount-row">
            <div class="detail-info">
              <span class="detail-label">Jumlah Bayar</span>
              <span class="detail-value amount">Rp ${formatCurrency(
                amount
              )}</span>
            </div>
            <button type="button" class="copy-button" data-copy-value="${amount}">
              <span class="copy-icon">📋</span> Copy
            </button>
          </div>

          <a href="${
            payment.qris.imagePath
          }" download="QRIS-SantiLiving.jpg" class="btn-download-qris">
            📥 Download QRIS
          </a>
        </div>

        <div class="payment-note info">
          <p>💡 Scan QRIS dengan aplikasi e-wallet atau mobile banking Anda.</p>
          <p>⚠️ QRIS ini adalah QRIS statis. Pastikan input nominal sesuai total di atas.</p>
        </div>
      </div>
    `;
  }

  // Bind copy buttons
  bindCopyButtons();
}

/**
 * Bind copy button events
 */
function bindCopyButtons(): void {
  document
    .querySelectorAll<HTMLButtonElement>(".copy-button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.copyValue;
        if (!value) return;

        try {
          await navigator.clipboard.writeText(value);

          // Visual feedback
          const originalText = button.innerHTML;
          button.innerHTML = "✓ Copied!";
          button.classList.add("copied");

          setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove("copied");
          }, 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      });
    });
}

/**
 * Navigate to step 1
 */
function goToStep1(): void {
  state.step = 1;
  elements.step1?.classList.add("active");
  elements.step2?.classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate to step 2
 */
function goToStep2(): void {
  state.step = 2;
  elements.step1?.classList.remove("active");
  elements.step2?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Confirm payment - redirect to thank you + open WhatsApp
 */
function confirmPayment(): void {
  const session = getOrder();
  if (!session) return;

  const { order } = session;
  const method = state.selectedMethod === "bca" ? "Transfer BCA" : "QRIS";

  // Compose WhatsApp message for payment proof
  const message = `Halo Santi Living,

Saya *${
    order.customerName
  }* ingin konfirmasi pembayaran untuk pesanan sewa kasur:

*Detail Pesanan:*
${order.items
  .map((item: any) => `- ${item.name} (${item.quantity}x)`)
  .join("\n")}

Durasi: ${order.duration} hari
Mulai: ${order.orderDate}
Total: Rp ${new Intl.NumberFormat("id-ID").format(order.totalPrice)}
Metode: ${method}

Alamat: ${order.deliveryAddress}

*Berikut bukti pembayaran saya:*
[Kirim foto bukti transfer/screenshot pembayaran]

Terima kasih!`;

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;

  // Open WhatsApp in new tab
  window.open(waUrl, "_blank");

  // Redirect to thank you page
  window.location.href = "/sewa-kasur/thank-you";
}
