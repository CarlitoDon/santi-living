/**
 * Calculator API Calls
 * Order submission and ERP integration
 */

import { saveOrder } from "../checkout-session";
import { getStateRef, getElements } from "./state";
import { showError, scrollToError } from "./validation";
import { formatAttributionForNotes } from "@/lib/attribution";

/**
 * Handle WhatsApp click - validate and submit order
 */
export async function handleWhatsAppClick(): Promise<void> {
  const state = getStateRef();
  const elements = getElements();

  // Get all field values
  const customerName = (elements.customerName as HTMLInputElement)?.value || "";
  const customerWhatsapp =
    (elements.customerWhatsapp as HTMLInputElement)?.value || "";
  const addressStreet =
    (elements.addressStreet as HTMLInputElement)?.value || "";
  const addressKelurahan =
    (elements.addressKelurahan as HTMLInputElement)?.value || "";
  const addressKecamatan =
    (elements.addressKecamatan as HTMLInputElement)?.value || "";
  const addressKota = (elements.addressKota as HTMLInputElement)?.value || "";
  const addressProvinsi =
    (elements.addressProvinsi as HTMLInputElement)?.value || "";
  const addressZip = (elements.addressZip as HTMLInputElement)?.value || "";
  const addressLat = (elements.addressLat as HTMLInputElement)?.value || "";
  const addressLng = (elements.addressLng as HTMLInputElement)?.value || "";
  const customerNotes =
    (elements.customerNotes as HTMLTextAreaElement)?.value || "";

  // Collect validation errors
  const validationErrors: { fieldId: string; message: string }[] = [];

  if (state.totalQuantity === 0) {
    validationErrors.push({
      fieldId: "mattressCart",
      message: "Pilih minimal 1 kasur",
    });
  }

  if (!state.startDate) {
    validationErrors.push({
      fieldId: "startDate",
      message: "Tanggal mulai wajib diisi",
    });
  }

  if (!customerName.trim()) {
    validationErrors.push({
      fieldId: "customerName",
      message: "Nama wajib diisi",
    });
  }

  if (!customerWhatsapp.trim()) {
    validationErrors.push({
      fieldId: "customerWhatsapp",
      message: "No. WhatsApp wajib diisi",
    });
  } else {
    const cleaned = customerWhatsapp.replace(/[\s-]/g, "");
    const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
    if (!patterns.some((p) => p.test(cleaned))) {
      validationErrors.push({
        fieldId: "customerWhatsapp",
        message: "Format nomor tidak valid (contoh: 08123456789)",
      });
    }
  }

  if (!addressStreet.trim()) {
    validationErrors.push({
      fieldId: "addressStreet",
      message: "Alamat jalan wajib diisi",
    });
  }

  if (!addressKota.trim()) {
    validationErrors.push({
      fieldId: "addressKota",
      message: "Kabupaten/Kota wajib diisi",
    });
  }

  // If there are errors, show them and scroll to first
  if (validationErrors.length > 0) {
    document
      .querySelectorAll(".form-error")
      .forEach((el) => (el.textContent = ""));
    document
      .querySelectorAll(".form-input, .form-textarea")
      .forEach((el) => el.classList.remove("error"));

    validationErrors.forEach((err) => {
      showError(err.fieldId, err.message);
    });

    scrollToError(validationErrors[0].fieldId);
    return;
  }

  // Build full address
  let fullAddress = addressStreet;
  if (addressKelurahan) fullAddress += `, ${addressKelurahan}`;
  if (addressKecamatan) fullAddress += `, ${addressKecamatan}`;
  if (addressKota) fullAddress += `, ${addressKota}`;
  if (addressProvinsi) fullAddress += `, ${addressProvinsi}`;
  if (addressZip) fullAddress += ` ${addressZip}`;
  if (addressLat && addressLng)
    fullAddress += ` (${addressLat}, ${addressLng})`;

  // Generate order ID
  const orderId = `SL-${Date.now().toString(36).toUpperCase()}`;
  const attributionNote = formatAttributionForNotes();
  const notesWithAttribution = [customerNotes.trim(), attributionNote]
    .filter(Boolean)
    .join("\n\n");

  const bookingData = {
    orderId: orderId,
    customerName: customerName,
    customerWhatsapp: customerWhatsapp,
    deliveryAddress: fullAddress,
    addressFields: {
      street: addressStreet,
      kelurahan: addressKelurahan,
      kecamatan: addressKecamatan,
      kota: addressKota,
      provinsi: addressProvinsi,
      zip: addressZip,
      lat: addressLat,
      lng: addressLng,
    },
    items: state.items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      pricePerDay: item.pricePerDay,
      includes: item.includes,
    })),
    totalPrice: state.total,
    orderDate: state.startDate || "",
    endDate: state.endDate || "",
    duration: state.duration,
    deliveryFee: state.deliveryFee || 0,
    paymentMethod: state.paymentMethod,
    notes: notesWithAttribution || undefined,
    volumeDiscountAmount: state.volumeDiscountAmount,
    volumeDiscountLabel: state.volumeDiscountLabel,
  };

  // Change button state to loading
  const waButton = elements.whatsappButton as HTMLButtonElement;
  const originalBtnText = waButton.innerHTML;
  waButton.disabled = true;
  waButton.innerHTML = `<span class="loading-spinner"></span> Memproses...`;

  try {
    // Save order to sessionStorage
    saveOrder(bookingData);

    // Call ERP to create order
    const { createOrderInERP } = await import("../../services/erp-api");
    const erpResponse = await createOrderInERP(bookingData);
    const orderUrl = erpResponse.orderUrl;

    // Store for thank-you page
    if (orderUrl) {
      sessionStorage.setItem("erpOrderUrl", orderUrl);
      sessionStorage.setItem("erpOrderNumber", erpResponse.orderNumber);
      sessionStorage.setItem("erpPublicToken", erpResponse.publicToken);
    }

    // Update button to show success
    waButton.innerHTML = `✓ Melanjutkan ke Checkout`;
    waButton.classList.add("success-btn");

    // Redirect to checkout
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 500);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Failed to process order:", error);
    waButton.disabled = false;
    waButton.innerHTML = originalBtnText;

    const errorMessage = (error.message || "").toLowerCase();

    if (
      errorMessage.includes("invalid_phone") ||
      errorMessage.includes("whatsapp") ||
      errorMessage.includes("nomor")
    ) {
      showError(
        "customerWhatsapp",
        "Nomor WhatsApp tidak terdaftar atau tidak aktif. Harap cek kembali.",
      );
      scrollToError("customerWhatsapp");
    } else if (errorMessage.includes("name") || errorMessage.includes("nama")) {
      showError("customerName", error.message);
      scrollToError("customerName");
    } else if (
      errorMessage.includes("address") ||
      errorMessage.includes("alamat")
    ) {
      showError("addressStreet", error.message);
      scrollToError("addressStreet");
    } else if (
      errorMessage.includes("mattress") ||
      errorMessage.includes("kasur") ||
      errorMessage.includes("quantity") ||
      errorMessage.includes("jumlah") ||
      errorMessage.includes("pilih")
    ) {
      showError(
        "mattressCart",
        error.message || "Pilih jumlah kasur dengan benar.",
      );
      scrollToError("mattressCart");
    } else {
      console.error("Booking Error:", error);
      alert(
        `Mohon maaf, terjadi kesalahan: ${
          error.message || "Gagal memproses pesanan"
        }. Silakan coba lagi.`,
      );

      waButton.classList.add("error-btn");
      setTimeout(() => waButton.classList.remove("error-btn"), 2000);
    }
  }
}
