import { useState, useCallback, useEffect, useRef } from "react";
import { useCalculatorState } from "./useCalculatorState";
import { CartSection } from "./CartSection";
import { ScheduleSection } from "./ScheduleSection";
import { CustomerSection } from "./CustomerSection";
import { AddressSection } from "./AddressSection";
import { ResultPanel } from "./ResultPanel";
import type { Product, CustomerData } from "./types";
import { getCurrentLocation, reverseGeocode } from "@/scripts/geolocation";
import { createOrderInERP, updateOrderInERP } from "@/services/erp-api";
import { saveOrder, getOrder } from "@/scripts/checkout-session";
import config from "@/data/config.json";

interface CalculatorProps {
  products: {
    mattressPackages: Product[];
    mattressOnly: Product[];
    accessories: Product[];
  };
  imageMap: Record<string, string>;
  imageMapLarge: Record<string, string>;
}

// Custom event type for location selection from map picker
interface LocationSelectedEventDetail {
  coords: { lat: number; lng: number };
  address: {
    street?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    postcode?: string;
  };
}

type LocationSelectedEvent = CustomEvent<LocationSelectedEventDetail>;

const initialCustomer: CustomerData = {
  name: "",
  whatsapp: "",
  address: {
    street: "",
    kelurahan: "",
    kelurahanKode: "",
    kecamatan: "",
    kecamatanKode: "",
    kota: "",
    kotaKode: "",
    provinsi: "Daerah Istimewa Yogyakarta",
    provinsiKode: "34",
    zip: "",
    lat: "",
    lng: "",
  },
  notes: "",
};

// Helper function (moved up so it can be used in useEffect)
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

export function Calculator({
  products,
  imageMap,
  imageMapLarge,
}: CalculatorProps) {
  const actions = useCalculatorState();
  const { state } = actions;

  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalOrderId, setOriginalOrderId] = useState<string | null>(null);

  // Ref to track if we've already pre-filled (prevents infinite loop)
  const hasPrefilledRef = useRef(false);

  // Detect edit mode and pre-fill from session (runs only once)
  useEffect(() => {
    // Skip if already pre-filled
    if (hasPrefilledRef.current) return;

    // Check if we're in edit mode (set by cart.astro)
    const editMode =
      (window as unknown as { __CALCULATOR_EDIT_MODE__?: boolean })
        .__CALCULATOR_EDIT_MODE__ === true;
    setIsEditMode(editMode);

    if (editMode) {
      const session = getOrder();
      if (session?.order) {
        // Mark as pre-filled to prevent running again
        hasPrefilledRef.current = true;

        const order = session.order;

        // Save original orderId for update
        if (order.orderId) {
          setOriginalOrderId(order.orderId);
        }

        // Pre-fill customer data
        setCustomer({
          name: order.customerName || "",
          whatsapp: order.customerWhatsapp || "",
          address: {
            street: order.addressFields?.street || "",
            kelurahan: order.addressFields?.kelurahan || "",
            kelurahanKode: order.addressFields?.kelurahanKode || "",
            kecamatan: order.addressFields?.kecamatan || "",
            kecamatanKode: order.addressFields?.kecamatanKode || "",
            kota: order.addressFields?.kota || "",
            kotaKode: order.addressFields?.kotaKode || "",
            provinsi:
              order.addressFields?.provinsi || "Daerah Istimewa Yogyakarta",
            provinsiKode: order.addressFields?.provinsiKode || "34",
            zip: order.addressFields?.zip || "",
            lat: order.addressFields?.lat || "",
            lng: order.addressFields?.lng || "",
          },
          notes: order.notes || "",
        });

        // Pre-fill duration
        if (order.duration) {
          actions.setDuration(order.duration);
        }

        // Pre-fill start date
        if (order.orderDate) {
          actions.setStartDate(order.orderDate);
        }

        // Pre-fill items - find products and add them
        const allProducts = [
          ...products.mattressPackages,
          ...products.mattressOnly,
          ...products.accessories,
        ];

        if (order.items && order.items.length > 0) {
          order.items.forEach(
            (item: {
              id?: string;
              name: string;
              quantity: number;
              pricePerDay?: number;
              category?: string;
              includes?: string[];
            }) => {
              // Find product by ID first, then by name
              const product =
                allProducts.find((p) => p.id === item.id) ||
                allProducts.find(
                  (p) =>
                    p.name === item.name ||
                    p.name.includes(item.name) ||
                    item.name.includes(p.name),
                );

              if (product) {
                for (let i = 0; i < item.quantity; i++) {
                  actions.addItem({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    pricePerDay: product.pricePerDay,
                    includes: product.includes,
                  });
                }
              }
            },
          );
        }

        // Pre-fill delivery fee if we have coordinates
        if (order.addressFields?.lat && order.addressFields?.lng) {
          const lat = parseFloat(order.addressFields.lat);
          const lng = parseFloat(order.addressFields.lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            const storeLocation = config.storeLocation;
            const distance = haversineDistance(
              lat,
              lng,
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
                config.deliveryZones[config.deliveryZones.length - 1]
                  .maxDistance
            ) {
              fee = Math.round(distance * config.deliveryPricePerKm);
              fee = Math.max(fee, config.minDeliveryPrice);
            }

            actions.setDeliveryFee(fee, distance);
          }
        }
      }
    }
  }, []); // Empty dependency - run only once on mount

  // Recalculate delivery fee when lat/lng changes (from dropdown or GPS)
  useEffect(() => {
    const { lat, lng } = customer.address;
    if (!lat || !lng) return;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return;

    const storeLocation = config.storeLocation;
    const distance = haversineDistance(
      latNum,
      lngNum,
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
  }, [customer.address.lat, customer.address.lng]);

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

      // Match address names to Nusantarakita kode values
      const { matchAddressToKode } = await import("@/services/address-matcher");
      const matched = await matchAddressToKode({
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kota: address.kota,
        provinsi: address.provinsi,
        postcode: address.postcode,
      });

      setCustomer((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: address.street || prev.address.street,
          kelurahan: matched.kelurahan || address.kelurahan || "",
          kelurahanKode: matched.kelurahanKode,
          kecamatan: matched.kecamatan || address.kecamatan || "",
          kecamatanKode: matched.kecamatanKode,
          kota: matched.kota || address.kota || "",
          kotaKode: matched.kotaKode,
          provinsi: address.provinsi || "DI Yogyakarta",
          provinsiKode: "34",
          zip: matched.zip || address.postcode || "",
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

      // Clear location error since we now have coordinates
      clearError("addressLocation");
    } catch (error) {
      alert((error as Error).message || "Gagal mendapatkan lokasi");
    }
  }, [actions, clearError]);

  const handleMapPickerClick = useCallback(() => {
    // Dispatch custom event to open map picker modal
    window.dispatchEvent(new CustomEvent("open-map-picker"));
  }, []);

  // Listen for location-selected event from map picker
  useEffect(() => {
    const handleLocationSelected = async (event: LocationSelectedEvent) => {
      const { coords, address } = event.detail;

      // Match address names to Nusantarakita kode values
      const { matchAddressToKode } = await import("@/services/address-matcher");
      const matched = await matchAddressToKode({
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kota: address.kota,
        provinsi: address.provinsi,
        postcode: address.postcode,
      });

      // Update customer address with matched kode values
      setCustomer((prev) => ({
        ...prev,
        address: {
          street: address.street || prev.address.street,
          kelurahan: matched.kelurahan || address.kelurahan || "",
          kelurahanKode: matched.kelurahanKode,
          kecamatan: matched.kecamatan || address.kecamatan || "",
          kecamatanKode: matched.kecamatanKode,
          kota: matched.kota || address.kota || "",
          kotaKode: matched.kotaKode,
          provinsi: address.provinsi || "Daerah Istimewa Yogyakarta",
          provinsiKode: "34",
          zip: matched.zip || address.postcode || "",
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

      // Clear location error since we now have coordinates
      clearError("addressLocation");
    };

    // Typed wrapper to satisfy addEventListener signature
    const eventHandler = (e: Event) => {
      handleLocationSelected(e as LocationSelectedEvent);
    };

    window.addEventListener("location-selected", eventHandler);
    return () => {
      window.removeEventListener("location-selected", eventHandler);
    };
  }, [actions, clearError]);

  // Handle deep links from product page (e.g., /?id=paket-single#calculator)
  useEffect(() => {
    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      const hash = window.location.hash;

      if (hash === "#calculator" && productId) {
        // Dispatch event to expand accordion and show all items
        window.dispatchEvent(
          new CustomEvent("expand-product-accordion", {
            detail: { productId },
          }),
        );

        // Wait for accordion to expand and items to render
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
        }, 800); // Longer delay to allow accordion expansion
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

    // Validate coordinates for delivery fee calculation
    if (!customer.address.lat || !customer.address.lng) {
      newErrors.addressLocation =
        "Lokasi wajib dipilih untuk menghitung ongkir. Gunakan tombol 'Pilih di Peta' atau 'Lokasi Saya'.";
    }

    setErrors(newErrors);
    return newErrors;
  }, [state, customer]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];

      // Special handling for addressLocation - scroll to location buttons
      if (firstErrorField === "addressLocation") {
        const locationButtons = document.getElementById("location-buttons");
        locationButtons?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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

      // Use existing orderId in edit mode, generate new one otherwise
      const orderId =
        isEditMode && originalOrderId
          ? originalOrderId
          : `SL-${Date.now().toString(36).toUpperCase()}`;

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

      // Save to session (update existing order data)
      saveOrder(bookingData);

      // Only create new order in ERP if not in edit mode
      // In edit mode, call update API to sync changes to sync-erp
      if (!isEditMode) {
        // Create in ERP
        const erpResponse = await createOrderInERP(bookingData);

        if (erpResponse.orderUrl) {
          sessionStorage.setItem("erpOrderUrl", erpResponse.orderUrl);
          sessionStorage.setItem("erpOrderNumber", erpResponse.orderNumber);
          sessionStorage.setItem("erpPublicToken", erpResponse.publicToken);
        }
      } else {
        // Update existing order in ERP
        const existingToken = sessionStorage.getItem("erpPublicToken");
        if (existingToken) {
          try {
            await updateOrderInERP(existingToken, bookingData);
          } catch (updateErr) {
            console.warn("Failed to update order in ERP:", updateErr);
            // Continue to checkout even if update fails — session data is already updated
          }
        }
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
              imageMapLarge={imageMapLarge}
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
            submitButtonText={
              isEditMode ? "Update Pesanan" : "Pesan via WhatsApp"
            }
          />
        </div>
      </div>
    </section>
  );
}
