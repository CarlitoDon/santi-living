/**
 * Checkout Page Logic
 * Handles multi-step checkout UI, payment method selection, and confirmation
 */

import { getOrder, setPaymentMethod, clearOrder } from "./checkout-session";
import { submitOrder } from "@/services/api";
import config from "@/data/config.json";
import { formatCurrency, formatDate } from "@/lib/format";

// Types
type PaymentMethod = "bca" | "qris";

interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  pricePerDay: number;
  includes?: string[];
}

interface OrderData {
  customerName: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  duration: number;
  deliveryFee: number;
  notes?: string;
}

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

  // Toggle mini summary visibility: Hide for QRIS as Snap UI has its own summary
  if (elements.summaryMiniContainer) {
    elements.summaryMiniContainer.style.display =
      method === "qris" ? "none" : "block";
  }

  // Toggle Back button visibility: Hide for QRIS to prevent accidental exit
  if (elements.btnBack) {
    elements.btnBack.style.display = method === "qris" ? "none" : "block";
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
  } else {
    container.innerHTML = `
      <div class="payment-method-card payment-qris" style="border:none; box-shadow:none; padding:0; background:transparent;">
        <div class="payment-details">
          <!-- Snap Container -->
          <div id="snap-container" class="snap-full-bleed" style="height: 85vh; border-radius: 12px; overflow: hidden;">
            <!-- Will be populated by Snap.js -->
          </div>
        </div>
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

    // Scroll to container
    setTimeout(() => {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Trigger embedded flow
    initSnapEmbedded();

    // Override Snap callbacks to use the loader
    // Note: We need to re-bind since initSnapEmbedded defines them internally?
    // Actually initSnapEmbedded is defined just below in this file? No, it's defined inside renderPaymentDetails?
    // Wait, initSnapEmbedded call logic is separated.
    // I should modify the `initSnapEmbedded` logic setup which likely uses the `snap.embed` call.
    // Let's modify the `window.snap.embed` callbacks directly in this block or where it is defined.

    // Ah, I see `initSnapEmbedded` call in the code I am replacing, but I don't see the DEFINITION of initSnapEmbedded in THIS Chunk.
    // I need to find where `snap.embed` is called.
    // It was in lines 500-530 in previous view.
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
async function initSnapEmbedded() {
  const container = document.getElementById("snap-container");
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 400px;">
      <div class="loading-spinner" style="margin-bottom: 1rem;"></div>
      <p style="color: #666; font-size: 0.9rem;">Menyiapkan QRIS...</p>
    </div>
  `;

  try {
    const session = getOrder();
    if (!session) return;
    const { order } = session;

    // 1. Ensure Order Exists (Get public token)
    let publicToken = sessionStorage.getItem("erpPublicToken");

    if (!publicToken) {
      // Create order if not exists (similar to legacy flow but background)
      const payload = { ...order, paymentMethod: "qris" as const };
      // console.log("Creating background order for Snap...", payload);
      const response = await submitOrder(payload);
      // Save token/url for later
      sessionStorage.setItem("erpPublicToken", response.token || "");
      if (response.orderUrl)
        sessionStorage.setItem("erpOrderUrl", response.orderUrl);
      publicToken = response.token; // update local var
    }

    if (!publicToken) throw new Error("Gagal membuat pesanan.");

    // 2. Get Snap Token
    // We need to import the service dynamically or use fetch directly
    // Using fetch directly to allow clean separate logic
    // But better to use the api helper if possible.
    // Let's rely on a helper we'll add or just fetch here
    // Checking previous context, we have `createPaymentToken` API proxy at `/api/create-payment-token`?
    // Wait, the previous steps added `createPaymentToken` procedure to TRPC but maybe not a direct API route for standard fetch from generic js?
    // Let's use the trpc client or a plain fetch to the TRPC endpoint if we can.
    // Actually, `santi-living/src/pages/api/create-payment-token.ts` exists!

    const tokenRes = await fetch("/api/create-payment-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: publicToken }),
    });

    if (!tokenRes.ok) throw new Error("Gagal mengambil token pembayaran.");
    const { token: snapToken } = await tokenRes.json();

    // 3. Embed Snap
    if (window.snap) {
      // Force close any existing popup/embed to prevent "PopupInView" error
      if (typeof window.snap.hide === "function") {
        window.snap.hide();
      }

      // Clear loading
      container.innerHTML = "";

      const showStatusMessage = (
        title: string,
        message: string,
        icon = "✅",
        showButton = false,
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
                ? `<a href="/sewa-kasur/pesanan/${publicToken}" class="btn-primary" style="
                    text-decoration: none; 
                    padding: 10px 20px; 
                    background: #2563eb; 
                    color: white; 
                    border-radius: 8px;
                    font-weight: 500;
                  ">Lihat Pesanan</a>`
                : ""
            }
          </div>
        `;
        container.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      window.snap.embed(snapToken, {
        embedId: "snap-container",
        onSuccess: function (_result: Record<string, unknown>) {
          // console.log("Payment success", result);
          showStatusMessage(
            "Pembayaran Berhasil!",
            "Sedang mengalihkan ke detail pesanan...",
            "✅",
          );
          setTimeout(() => {
            window.location.href = `/sewa-kasur/pesanan/${publicToken}`;
          }, 1500);
        },
        onPending: function (_result: Record<string, unknown>) {
          // console.log("Payment pending", result);
          // Pending means order created but not paid (e.g. closed popup or chose non-instant method)
          showStatusMessage(
            "Menunggu Pembayaran",
            "Pesanan telah dibuat. Silakan selesaikan pembayaran atau cek status di halaman pesanan.",
            "⏳",
            true,
          );
        },
        onError: function (_result: Record<string, unknown>) {
          // console.error("Payment error", result);
          container.innerHTML =
            '<p style="color:red; text-align:center;">Pembayaran gagal. Silakan coba lagi.</p>';
        },
        onClose: function () {
          // Handle close event if supported in embed mode
          showStatusMessage(
            "Pembayaran Belum Selesai",
            "Anda menutup halaman pembayaran. Silakan cek detail pesanan untuk melanjutkan.",
            "⚠️",
            true,
          );
        },
      });
    } else {
      throw new Error("Midtrans script not loaded.");
    }
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
      window.location.href = `/sewa-kasur/pesanan/${publicToken}`;
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
        sessionStorage.getItem("erpOrderUrl") ||
        `/sewa-kasur/pesanan/${publicToken}`;
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
      window.location.href = "/sewa-kasur/thank-you";
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
