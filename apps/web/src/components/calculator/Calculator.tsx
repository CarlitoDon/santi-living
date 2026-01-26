/**
 * Calculator React Component
 * Main container that orchestrates all sections
 */

import { useState, useCallback, useEffect } from "react";
import { useCalculatorState } from "./useCalculatorState";
import { CartSection } from "./CartSection";
import { ScheduleSection } from "./ScheduleSection";
import { CustomerSection } from "./CustomerSection";
import { AddressSection } from "./AddressSection";
import { ResultPanel } from "./ResultPanel";
import type { Product, CustomerData } from "./types";
import { getCurrentLocation, reverseGeocode } from "@/scripts/geolocation";
import { createOrderInERP } from "@/services/erp-api";
import { saveOrder } from "@/scripts/checkout-session";
import config from "@/data/config.json";

interface CalculatorProps {
  products: {
    mattressPackages: Product[];
    mattressOnly: Product[];
    accessories: Product[];
  };
  imageMap: Record<string, string>;
}

const initialCustomer: CustomerData = {
  name: "",
  whatsapp: "",
  address: {
    street: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "DI Yogyakarta",
    zip: "",
    lat: "",
    lng: "",
  },
  notes: "",
};

export function Calculator({ products, imageMap }: CalculatorProps) {
  const actions = useCalculatorState();
  const { state } = actions;

  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      void _removed;
      return rest;
    });
  }, []);

  const handleCustomerChange = useCallback((updates: Partial<CustomerData>) => {
    setCustomer((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleLocationClick = useCallback(async () => {
    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords);

      setCustomer((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: address.street || prev.address.street,
          kelurahan: address.kelurahan || "",
          kecamatan: address.kecamatan || "",
          kota: address.kota || "",
          provinsi: address.provinsi || "DI Yogyakarta",
          zip: address.postcode || "",
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
        },
      }));

      // Calculate delivery fee based on distance
      const storeLocation = config.storeLocation;
      const distance = haversineDistance(
        coords.latitude,
        coords.longitude,
        storeLocation.lat,
        storeLocation.lng,
      );

      // Simple delivery fee calculation based on zones
      let fee = 0;
      for (const zone of config.deliveryZones) {
        if (distance <= zone.maxDistance) {
          fee = zone.price;
          break;
        }
      }
      if (
        fee === 0 &&
        distance >
          config.deliveryZones[config.deliveryZones.length - 1].maxDistance
      ) {
        fee = Math.round(distance * config.deliveryPricePerKm);
        fee = Math.max(fee, config.minDeliveryPrice);
      }

      actions.setDeliveryFee(fee, distance);
    } catch (error) {
      alert((error as Error).message || "Gagal mendapatkan lokasi");
    }
  }, [actions]);

  const handleMapPickerClick = useCallback(() => {
    // Dispatch custom event to open map picker modal
    window.dispatchEvent(new CustomEvent("open-map-picker"));
  }, []);

  // Listen for location-selected event from map picker
  useEffect(() => {
    const handleLocationSelected = (
      event: CustomEvent<{
        coords: { lat: number; lng: number };
        address: {
          street?: string;
          kelurahan?: string;
          kecamatan?: string;
          kota?: string;
          provinsi?: string;
          postcode?: string;
        };
      }>,
    ) => {
      const { coords, address } = event.detail;

      // Update customer address
      setCustomer((prev) => ({
        ...prev,
        address: {
          street: address.street || prev.address.street,
          kelurahan: address.kelurahan || "",
          kecamatan: address.kecamatan || "",
          kota: address.kota || "",
          provinsi: address.provinsi || "DI Yogyakarta",
          zip: address.postcode || "",
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
        },
      }));

      // Calculate delivery fee
      const storeLocation = config.storeLocation;
      const distance = haversineDistance(
        coords.lat,
        coords.lng,
        storeLocation.lat,
        storeLocation.lng,
      );

      let fee = 0;
      for (const zone of config.deliveryZones) {
        if (distance <= zone.maxDistance) {
          fee = zone.price;

          break;
        }
      }
      if (
        fee === 0 &&
        distance >
          config.deliveryZones[config.deliveryZones.length - 1].maxDistance
      ) {
        fee = Math.round(distance * config.deliveryPricePerKm);
        fee = Math.max(fee, config.minDeliveryPrice);
      }

      actions.setDeliveryFee(fee, distance);
    };

    window.addEventListener(
      "location-selected",
      handleLocationSelected as EventListener,
    );
    return () => {
      window.removeEventListener(
        "location-selected",
        handleLocationSelected as EventListener,
      );
    };
  }, [actions]);

  // Handle deep links from product page (e.g., /?id=paket-single#calculator)
  useEffect(() => {
    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      const hash = window.location.hash;

      if (hash === "#calculator" && productId) {
        // Wait a bit for React to fully render
        setTimeout(() => {
          const productEl = document.querySelector(
            `[data-product-id="${productId}"]`,
          );

          if (productEl) {
            // Scroll to the product
            productEl.scrollIntoView({ behavior: "smooth", block: "center" });

            // Add highlight pulse effect
            productEl.classList.add("highlight-pulse");

            // Remove the effect after animation completes (4 iterations * 1s = 4s)
            setTimeout(() => {
              productEl.classList.remove("highlight-pulse");
            }, 4000);
          }
        }, 500);
      }
    };

    handleDeepLink();
  }, []);

  // Listen for modal stepper events
  useEffect(() => {
    const allProducts = [
      ...products.mattressPackages,
      ...products.mattressOnly,
      ...products.accessories,
    ];

    const handleModalIncrement = (
      event: CustomEvent<{ productId: string }>,
    ) => {
      const { productId } = event.detail;
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        actions.addItem({
          id: product.id,
          name: product.name,
          category: product.category,
          pricePerDay: product.pricePerDay,
          includes: product.includes,
        });
      }
    };

    const handleModalDecrement = (
      event: CustomEvent<{ productId: string }>,
    ) => {
      const { productId } = event.detail;
      actions.removeItem(productId);
    };

    window.addEventListener(
      "modal-product-increment",
      handleModalIncrement as EventListener,
    );
    window.addEventListener(
      "modal-product-decrement",
      handleModalDecrement as EventListener,
    );

    return () => {
      window.removeEventListener(
        "modal-product-increment",
        handleModalIncrement as EventListener,
      );
      window.removeEventListener(
        "modal-product-decrement",
        handleModalDecrement as EventListener,
      );
    };
  }, [actions, products]);

  const validateForm = useCallback((): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (state.totalQuantity === 0) {
      newErrors.mattressCart = "Pilih minimal 1 kasur";
    }

    if (!state.startDate) {
      newErrors.startDate = "Tanggal mulai wajib diisi";
    }

    if (!customer.name.trim()) {
      newErrors.customerName = "Nama wajib diisi";
    }

    if (!customer.whatsapp.trim()) {
      newErrors.customerWhatsapp = "No. WhatsApp wajib diisi";
    } else {
      const cleaned = customer.whatsapp.replace(/[\s-]/g, "");
      const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
      if (!patterns.some((p) => p.test(cleaned))) {
        newErrors.customerWhatsapp =
          "Format nomor tidak valid (contoh: 08123456789)";
      }
    }

    if (!customer.address.street.trim()) {
      newErrors.addressStreet = "Alamat jalan wajib diisi";
    }

    if (!customer.address.kelurahan.trim()) {
      newErrors.addressKelurahan = "Kelurahan wajib diisi";
    }

    if (!customer.address.kecamatan.trim()) {
      newErrors.addressKecamatan = "Kecamatan wajib diisi";
    }

    if (!customer.address.kota.trim()) {
      newErrors.addressKota = "Kabupaten/Kota wajib diisi";
    }

    if (!customer.address.zip.trim()) {
      newErrors.addressZip = "Kode Pos wajib diisi";
    }

    setErrors(newErrors);
    return newErrors;
  }, [state, customer]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build full address
      let fullAddress = customer.address.street;
      if (customer.address.kelurahan)
        fullAddress += `, ${customer.address.kelurahan}`;
      if (customer.address.kecamatan)
        fullAddress += `, ${customer.address.kecamatan}`;
      if (customer.address.kota) fullAddress += `, ${customer.address.kota}`;
      if (customer.address.provinsi)
        fullAddress += `, ${customer.address.provinsi}`;
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
        orderDate: state.startDate || "",
        endDate: state.endDate || "",
        duration: state.duration,
        deliveryFee: state.deliveryFee || 0,
        paymentMethod: state.paymentMethod,
        notes: customer.notes,
        volumeDiscountAmount: state.volumeDiscountAmount,
        volumeDiscountLabel: state.volumeDiscountLabel,
      };

      // Save to session
      saveOrder(bookingData);

      // Create in ERP
      const erpResponse = await createOrderInERP(bookingData);

      if (erpResponse.orderUrl) {
        sessionStorage.setItem("erpOrderUrl", erpResponse.orderUrl);
        sessionStorage.setItem("erpOrderNumber", erpResponse.orderNumber);
        sessionStorage.setItem("erpPublicToken", erpResponse.publicToken);
      }

      // Redirect to checkout
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Failed to submit order:", error);
      alert(
        `Mohon maaf, terjadi kesalahan: ${
          (error as Error).message || "Gagal memproses pesanan"
        }. Silakan coba lagi.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, customer, state, errors]);

  return (
    <section
      id="calculator"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-primary-light, #dbeafe) 0%, var(--color-background, #ffffff) 15%, var(--color-background, #ffffff) 100%)",
        paddingTop: "2rem",
        paddingBottom: "1.5rem",
        borderRadius: "24px 24px 0 0",
        marginTop: "2rem",
      }}
    >
      <div style={{ padding: "0 1rem" }}>
        <h2
          className="font-bold text-center text-slate-800"
          style={{ fontSize: "1.25rem", marginBottom: "2rem" }}
        >
          ⚡️ Form Pesan Instan
        </h2>

        <div style={{ maxWidth: "576px", margin: "0 auto" }}>
          {/* Form Panel */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              marginBottom: "1rem",
            }}
          >
            <CartSection
              products={products}
              imageMap={imageMap}
              actions={actions}
              error={errors.mattressCart}
            />

            <ScheduleSection actions={actions} errors={errors} />

            <CustomerSection
              customer={customer}
              onChange={handleCustomerChange}
              errors={errors}
              onClearError={clearError}
            />

            <AddressSection
              customer={customer}
              onChange={handleCustomerChange}
              errors={errors}
              onClearError={clearError}
              onLocationClick={handleLocationClick}
              onMapPickerClick={handleMapPickerClick}
            />
          </div>

          {/* Result Panel */}
          <ResultPanel
            state={state}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </section>
  );
}

// Helper function
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
