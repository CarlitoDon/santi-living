// ==========================================================================
// Map Picker - Leaflet + OpenStreetMap
// ==========================================================================

import L from "leaflet";
import { reverseGeocode } from "./geolocation";
import type { FormattedAddress } from "./geolocation";

// Default center: Yogyakarta
const DEFAULT_CENTER: [number, number] = [-7.797068, 110.370529];
const DEFAULT_ZOOM = 13;

interface MapPickerOptions {
  onConfirm: (
    coords: { lat: number; lng: number },
    address: FormattedAddress,
  ) => void;
  onCancel?: () => void;
}

let map: L.Map | null = null;
let marker: L.Marker | null = null;
let modal: HTMLElement | null = null;
let selectedCoords: { lat: number; lng: number } | null = null;
let currentOptions: MapPickerOptions | null = null;

/**
 * Create and show the map picker modal
 */
export function openMapPicker(options: MapPickerOptions): void {
  currentOptions = options;

  // Create modal if not exists
  if (!modal) {
    createModal();
  }

  // Show modal
  modal!.classList.add("active");
  document.body.style.overflow = "hidden";

  // Initialize map after modal is visible
  setTimeout(() => {
    initMap();

    // Try to get user's current location to center map (but don't set marker)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Only center the view - don't set marker here
          // User must explicitly click on the map to select a location
          map?.setView([latitude, longitude], 16);
        },
        () => {
          // Use default center if location fails
          map?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        },
      );
    }
  }, 100);
}

/**
 * Create the modal HTML
 */
function createModal(): void {
  modal = document.createElement("div");
  modal.className = "map-picker-modal";
  modal.innerHTML = `
    <div class="map-picker-overlay"></div>
    <div class="map-picker-content">
      <div class="map-picker-header">
        <h3>Pilih Lokasi Pengantaran</h3>
        <p class="map-picker-hint">Klik pada peta untuk menentukan lokasi</p>
      </div>
      <div class="map-picker-map" id="mapPickerMap"></div>
      <div class="map-picker-address" id="mapPickerAddress">
        <span class="address-text">Klik pada peta untuk memilih lokasi...</span>
      </div>
      <div class="map-picker-actions">
        <button type="button" class="btn-map-cancel" id="mapPickerCancel">Batal</button>
        <button type="button" class="btn-map-confirm" id="mapPickerConfirm" disabled>Konfirmasi Lokasi</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Bind events
  modal
    .querySelector(".map-picker-overlay")
    ?.addEventListener("click", closeModal);
  modal
    .querySelector("#mapPickerCancel")
    ?.addEventListener("click", closeModal);
  modal
    .querySelector("#mapPickerConfirm")
    ?.addEventListener("click", confirmLocation);
}

/**
 * Initialize Leaflet map
 */
function initMap(): void {
  const mapContainer = document.getElementById("mapPickerMap");
  if (!mapContainer || map) return;

  map = L.map(mapContainer, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
  });

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Handle map click
  map.on("click", handleMapClick);
}

/**
 * Handle map click to set marker
 */
async function handleMapClick(e: L.LeafletMouseEvent): Promise<void> {
  const { lat, lng } = e.latlng;
  setMarker(lat, lng);

  // Update address display
  const addressEl = document.getElementById("mapPickerAddress");
  if (addressEl) {
    addressEl.innerHTML =
      '<span class="address-loading">Mencari alamat...</span>';
  }

  try {
    const address = await reverseGeocode({ latitude: lat, longitude: lng });
    if (addressEl) {
      addressEl.innerHTML = `<span class="address-text">${address.fullAddress}</span>`;
    }

    // Enable confirm button
    const confirmBtn = document.getElementById(
      "mapPickerConfirm",
    ) as HTMLButtonElement;
    if (confirmBtn) {
      confirmBtn.disabled = false;
    }
  } catch {
    if (addressEl) {
      addressEl.innerHTML =
        '<span class="address-error">Tidak dapat mendapatkan alamat</span>';
    }
  }
}

/**
 * Set marker on map
 */
function setMarker(lat: number, lng: number): void {
  selectedCoords = { lat, lng };

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else if (map) {
    marker = L.marker([lat, lng], {
      draggable: true,
    }).addTo(map);

    // Handle marker drag
    marker.on("dragend", async () => {
      const pos = marker!.getLatLng();
      selectedCoords = { lat: pos.lat, lng: pos.lng };

      const addressEl = document.getElementById("mapPickerAddress");
      if (addressEl) {
        addressEl.innerHTML =
          '<span class="address-loading">Mencari alamat...</span>';
      }

      try {
        const address = await reverseGeocode({
          latitude: pos.lat,
          longitude: pos.lng,
        });
        if (addressEl) {
          addressEl.innerHTML = `<span class="address-text">${address.fullAddress}</span>`;
        }
      } catch {
        if (addressEl) {
          addressEl.innerHTML =
            '<span class="address-error">Tidak dapat mendapatkan alamat</span>';
        }
      }
    });
  }
}

/**
 * Confirm selected location
 */
async function confirmLocation(): Promise<void> {
  if (!selectedCoords || !currentOptions) return;

  const confirmBtn = document.getElementById(
    "mapPickerConfirm",
  ) as HTMLButtonElement;
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Memproses...";
  }

  try {
    const address = await reverseGeocode({
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
    });

    currentOptions.onConfirm(selectedCoords, address);
    closeModal();
  } catch {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Konfirmasi Lokasi";
    }
  }
}

/**
 * Close the modal
 */
function closeModal(): void {
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  currentOptions?.onCancel?.();

  // Reset state
  selectedCoords = null;
  if (marker && map) {
    map.removeLayer(marker);
    marker = null;
  }

  // Reset confirm button
  const confirmBtn = document.getElementById(
    "mapPickerConfirm",
  ) as HTMLButtonElement;
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Konfirmasi Lokasi";
  }
}
