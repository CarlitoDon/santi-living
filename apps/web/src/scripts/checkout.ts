/**
 * Checkout Page Logic
 * Handles multi-step checkout UI, payment method selection, and confirmation
 */

import { getOrder, setPaymentMethod, clearOrder } from "./checkout-session";
import { submitOrder } from "@/services/api";
import config from "@/data/config.json";
import { formatCurrency, formatDate } from "@/lib/format";
import type { OrderItem, OrderData } from "@/types/order";

// Types
type PaymentMethod = "bca" | "gopay" | "qris";

interface SnapEmbedOptions {
  embedId: string;
  onSuccess: (result: Record<string, unknown>) => void;
  onPending: (result: Record<string, unknown>) => void;
  onError: (result: Record<string, unknown>) => void;
  onClose?: () => void;
}

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
    window.location.href = "/#calculator";
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
function renderSummary(order: OrderData): void {
  const container = elements.summaryContainer;
  if (!container) return;

  // Calculate values
  const subtotal = order.totalPrice - order.deliveryFee;
  const startDate = new Date(order.orderDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + order.duration - 1);

  // Build items HTML
  const itemsHtml = order.items
    .map(
      (item: OrderItem) => `
      <div class="summary-item">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-qty">${item.quantity}x</span>
        </div>
        <span class="item-price">Rp ${formatCurrency(
          item.pricePerDay * item.quantity * order.duration,
        )}</span>
      </div>
    `,
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
            endDate,
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
            order.deliveryFee,
          )}</span>
        </div>
        <div class="summary-row total">
          <span class="summary-label">Total</span>
          <span class="summary-value">Rp ${formatCurrency(
            order.totalPrice,
          )}</span>
        </div>
      </div>

      <a href="/cart" class="btn-edit-order">
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
function renderMiniSummary(order: OrderData): void {
  const container = elements.summaryMiniContainer;
  if (!container) return;

  const itemCount = order.items.reduce(
    (sum: number, item: OrderItem) => sum + item.quantity,
    0,
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

  // Toggle mini summary visibility: Hide for QRIS/GoPay as Snap UI has its own summary
  if (elements.summaryMiniContainer) {
    elements.summaryMiniContainer.style.display =
      method === "qris" || method === "gopay" ? "none" : "block";
  }

  const session = getOrder();
  if (!session) return;

  const amount = session.order.totalPrice;
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
                amount,
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
  } else if (method === "gopay" || method === "qris") {
    // Both GoPay and QRIS use Snap embed
    container.innerHTML = `
      <div class="payment-method-card snap-wrapper" style="
        background: var(--color-surface);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        border: 1px solid var(--color-border);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        max-width: 100%;
        margin: 0 auto;
      ">
        <h4 style="
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0 0 var(--space-3);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--color-border);
        ">${method === "gopay" ? "💚 Pembayaran GoPay" : "📱 Pembayaran QRIS"}</h4>
        <div id="snap-container" style="
          min-height: 650px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        ">
          <!-- Will be populated by Snap.js -->
        </div>
        <style>
          #snap-container iframe {
            width: 320px !important;
            min-width: 320px !important;
            min-height: 720px !important;
          }
          @media (max-width: 100%) {
            #snap-container iframe {
              min-width: 320px !important;
            }
          }
        </style>
      </div>
    `;

    // Hide confirm button for QRIS (Snap handle it inside)
    const btnConfirm = elements.btnConfirmPayment;
    if (btnConfirm) {
      btnConfirm.style.display = "none";
      // Also hide the sticky container to prevent empty box
      const stickyContainer = document.querySelector(
        ".checkout-confirm-sticky",
      ) as HTMLElement;
      if (stickyContainer) stickyContainer.style.display = "none";
    }

    // Make payment details span full width and center it
    const miniSummary = document.getElementById("summaryMiniContainer");
    if (miniSummary) miniSummary.style.display = "none";

    // Make the container span full grid width
    container.style.gridColumn = "1 / -1";
    container.style.display = "flex";
    container.style.justifyContent = "center";

    // Scroll to container
    setTimeout(() => {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Trigger embedded flow
    initSnapPayment();

    // Snap callbacks are handled within initSnapPayment via window.snap.pay
    // which injects the UI into #snap-container
  }

  // Bind copy buttons (only for BCA now, but keeping helper)
  bindCopyButtons();

  // Reset button text if BCA selected
  if (method === "bca") {
    const btnConfirm = elements.btnConfirmPayment;
    if (btnConfirm) {
      btnConfirm.innerHTML = "✓ Saya Sudah Bayar";
      // Reset styles overridden by QRIS view
      btnConfirm.style.display = "block";
      btnConfirm.style.background = "";
      btnConfirm.style.color = "";
      btnConfirm.style.border = "";

      // Restore sticky container
      const stickyContainer = document.querySelector(
        ".checkout-confirm-sticky",
      ) as HTMLElement;
      if (stickyContainer) stickyContainer.style.display = "";
    }
  }
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
  state.selectedMethod = null;

  // DON'T clear erpPublicToken - order already exists
  // We just need to update the payment method when user selects again

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
 * Confirm payment - call API and redirect
 */
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          gopayMode?: "qr" | "deeplink";
          onSuccess: (result: Record<string, unknown>) => void;
          onPending: (result: Record<string, unknown>) => void;
          onError: (result: Record<string, unknown>) => void;
          onClose: () => void;
        },
      ) => void;
      embed: (token: string, options: SnapEmbedOptions) => void;
      hide?: () => void;
    };
  }
}

/**
 * Initialize Embedded Snap Payment
 */
/**
 * Initialize Snap Payment (Popup)
 */
async function initSnapPayment() {
  const container = document.getElementById("snap-container");
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 350px;">
      <div class="loading-spinner" style="margin-bottom: 1rem;"></div>
      <p style="color: #666; font-size: 0.9rem;">Menyiapkan Pembayaran...</p>
    </div>
  `;

  try {
    // 1. Get public token
    const publicToken = sessionStorage.getItem("erpPublicToken");
    if (!publicToken) {
      throw new Error(
        "Pesanan tidak ditemukan. Silakan kembali ke halaman utama.",
      );
    }

    // 2. Update payment method on existing order
    const paymentMethod = state.selectedMethod === "gopay" ? "gopay" : "qris";
    console.log(
      "[Checkout] selectedMethod:",
      state.selectedMethod,
      "-> paymentMethod:",
      paymentMethod,
    );

    const updateRes = await fetch("/api/update-payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: publicToken, paymentMethod }),
    });

    const updateData = await updateRes.json();
    if (!updateRes.ok) {
      throw new Error(
        updateData.error || "Gagal mengupdate metode pembayaran.",
      );
    }

    container.innerHTML = "";

    // Helper for Status Messages
    const showStatusMessage = (
      title: string,
      message: string,
      icon = "✅",
      showButton = false,
      isRetry = false,
    ) => {
      container.innerHTML = `
        <div style="
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          height: 350px; 
          background: #f8fafc; 
          border-radius: 12px;
          text-align: center;
          padding: 20px;
          animation: fade-in 0.5s;
        ">
          <div style="font-size: 40px; margin-bottom: 15px;">${icon}</div>
          <h3 style="color: #0f172a; margin-bottom: 8px;">${title}</h3>
          <p style="color: #64748b; margin-bottom: 20px;">${message}</p>
          ${
            showButton
              ? `<a href="/pesanan/${publicToken}" class="btn-primary" style="
                  text-decoration: none; 
                  padding: 10px 20px; 
                  background: #2563eb; 
                  color: white; 
                  border-radius: 8px;
                  font-weight: 500;
                  margin-right: ${isRetry ? "10px" : "0"};
                ">Lihat Pesanan</a>`
              : ""
          }
          ${
            isRetry
              ? `<button id="btn-retry-snap" style="
                  padding: 10px 20px; 
                  background: #065f46; 
                  color: white; 
                  border: none;
                  border-radius: 8px;
                  font-weight: 500;
                  cursor: pointer;
                ">Bayar Sekarang</button>`
              : ""
          }
        </div>
      `;
      container.scrollIntoView({ behavior: "smooth", block: "center" });

      if (isRetry) {
        document
          .getElementById("btn-retry-snap")
          ?.addEventListener("click", () => {
            initSnapPayment();
          });
      }
    };

    // 3. Create Snap Token (Unified Flow)
    // Both GoPay and QRIS use Snap.
    // We pass 'paymentMethod' so backend can set enabled_payments accordingly.
    console.log(`[Checkout] Creating Snap token for ${paymentMethod}...`);

    const tokenRes = await fetch("/api/create-payment-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: publicToken, paymentMethod }),
    });

    if (!tokenRes.ok) throw new Error("Gagal mengambil token pembayaran.");
    const { token: snapToken } = await tokenRes.json();

    const triggerSnap = () => {
      if (window.snap) {
        if (window.snap.hide) {
          window.snap.hide();
        }
        // Logic to determine UI Mode
        const embedOptions: SnapEmbedOptions & {
          uiMode?: "qr" | "deeplink" | "auto";
        } = {
          embedId: "snap-container",
          onSuccess: function (_result: Record<string, unknown>) {
            showStatusMessage(
              "Pembayaran Berhasil!",
              "Sedang mengalihkan ke detail pesanan...",
              "✅",
            );
            setTimeout(() => {
              window.location.href = `/pesanan/${publicToken}`;
            }, 1500);
          },
          onPending: function (_result: Record<string, unknown>) {
            showStatusMessage(
              "Menunggu Pembayaran",
              "Pesanan telah dibuat. Silakan selesaikan pembayaran atau cek status di halaman pesanan.",
              "⏳",
              true,
              true, // Allow retry
            );
          },
          onError: function (_result: Record<string, unknown>) {
            container.innerHTML =
              '<p style="color:red; text-align:center;">Pembayaran gagal. Silakan coba lagi.</p>';
          },
          onClose: function () {
            showStatusMessage(
              "Pembayaran Belum Selesai",
              "Anda menutup popup pembayaran.",
              "⚠️",
              true,
              true, // Allow retry
            );
          },
        };

        // If QRIS selected, force QR mode (GoPay will show QR)
        if (paymentMethod === "qris") {
          embedOptions.uiMode = "qr";
        }

        window.snap.embed(snapToken, embedOptions);
      } else {
        console.error("Snap JS not loaded");
        container.innerHTML =
          '<p style="color:red; text-align:center;">Gagal memuat sistem pembayaran.</p>';
      }
    };

    triggerSnap();
  } catch (err: unknown) {
    console.error("Snap Init Failed:", err);
    if (container) {
      const message = err instanceof Error ? err.message : "Unknown error";
      container.innerHTML = `<p style="color:red; text-align:center;">Gagal memuat pembayaran: ${message}</p>`;
    }
  }
}

/**
 * Confirm payment - call API and redirect
 */
async function confirmPayment(): Promise<void> {
  // If QRIS, checking status or just redirecting
  if (state.selectedMethod === "qris") {
    const publicToken = sessionStorage.getItem("erpPublicToken");
    if (publicToken) {
      window.location.href = `/pesanan/${publicToken}`;
      return;
    }
  }

  const session = getOrder();
  if (!session) return;

  // ... rest of manual confirmation logic for BCA ...
  const btn = elements.btnConfirmPayment as HTMLButtonElement;
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  try {
    const { order } = session;
    const method = "transfer"; // Only BCA uses this flow now
    const publicToken = sessionStorage.getItem("erpPublicToken");

    let orderUrl = "";

    if (publicToken) {
      const { confirmPayment: apiConfirm } = await import("@/services/erp-api");
      await apiConfirm(publicToken, method);
      orderUrl =
        sessionStorage.getItem("erpOrderUrl") || `/pesanan/${publicToken}`;
    } else {
      const payload = {
        ...order,
        paymentMethod: method as "transfer" | "qris",
      };
      const response = await submitOrder(payload);
      orderUrl = response.orderUrl || "";
    }

    clearOrder();
    if (orderUrl) {
      window.location.href = orderUrl;
    } else {
      window.location.href = "/thank-you";
    }
  } catch (error) {
    console.error("Payment confirmation failed:", error);
    alert(
      "Gagal memproses pembayaran: " +
        (error instanceof Error ? error.message : "Unknown error"),
    );

    if (btn) {
      btn.disabled = false;
      btn.textContent = "✓ Saya Sudah Bayar";
    }
  }
}
