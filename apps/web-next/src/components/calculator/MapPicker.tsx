"use client";

import { useEffect, useRef, useState } from "react";
import { reverseGeocode } from "@/scripts/geolocation";
import { showAlert } from "@/utils/alert";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [-7.797068, 110.370529];
const DEFAULT_ZOOM = 13;

export function MapPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [addressDisplay, setAddressDisplay] = useState("Klik pada peta untuk memilih lokasi...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      console.log("MapPicker: open-map-picker event received");
      setIsOpen(true);
      setAddressDisplay("Klik pada peta untuk memilih lokasi...");
      setSelectedCoords(null);
    };

    window.addEventListener("open-map-picker", handleOpen);
    return () => {
      window.removeEventListener("open-map-picker", handleOpen);
    };
  }, []);

  // Initialize map when modal opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      // Lazy load Leaflet only when modal opens
      const Leaflet = await import("leaflet");
      const L = Leaflet.default;

      if (!isMounted || !mapContainerRef.current) return;

      // Custom icon setup for leaflet in Next.js/Browser
      const iconDefault = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        const setMarker = (lat: number, lng: number) => {
          setSelectedCoords({ lat, lng });
          
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
            
            markerRef.current.on("dragend", async () => {
              if (markerRef.current) {
                const pos = markerRef.current.getLatLng();
                setSelectedCoords({ lat: pos.lat, lng: pos.lng });
                await updateAddress(pos.lat, pos.lng);
              }
            });
          }
        };

        const updateAddress = async (lat: number, lng: number) => {
          setAddressDisplay("Mencari alamat...");
          try {
            const address = await reverseGeocode({ latitude: lat, longitude: lng });
            setAddressDisplay(address.fullAddress);
          } catch {
            setAddressDisplay("Tidak dapat mendapatkan alamat");
          }
        };

        map.on("click", async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setMarker(lat, lng);
          await updateAddress(lat, lng);
        });

        // Try current location
        console.log("MapPicker: Attempting initial GPS centering...");
        if (navigator.geolocation && window.isSecureContext) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if (isMounted) {
                map.setView([latitude, longitude], 16);
                setMarker(latitude, longitude);
                updateAddress(latitude, longitude);
              }
            },
            () => {
              // failed to load GPS, keep default
            }
          );
        }
      }

      // Fix leaflet mounting rendering issues
      setTimeout(() => {
        if (isMounted) mapInstanceRef.current?.invalidateSize();
      }, 100);
    }

    initMap();
    
    // Prevent document scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      isMounted = false;
      document.body.style.overflow = "";
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    if (!selectedCoords) return;
    setIsProcessing(true);

    try {
      const address = await reverseGeocode({
        latitude: selectedCoords.lat,
        longitude: selectedCoords.lng,
      });

      window.dispatchEvent(
        new CustomEvent("location-selected", {
          detail: {
            coords: selectedCoords,
            address,
          },
        })
      );
      
      handleClose();
    } catch {
      showAlert("Gagal mendapatkan detail alamat untuk lokasi ini.", "Pencarian Lokasi Gagal", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="map-picker-modal active">
      <div className="map-picker-overlay" onClick={handleClose}></div>
      <div className="map-picker-content">
        <div className="map-picker-header">
          <h3 className="text-lg font-semibold m-0">Pilih Lokasi Pengantaran</h3>
          <p className="map-picker-hint">Klik pada peta untuk menentukan lokasi</p>
        </div>
        <div className="map-picker-map" ref={mapContainerRef}></div>
        <div className="map-picker-address min-h-[48px] flex items-center p-4 bg-slate-50 border-t border-slate-200">
          <span className="address-text text-sm text-slate-700">{addressDisplay}</span>
        </div>
        <div className="map-picker-actions">
          <button type="button" className="btn-map-cancel" onClick={handleClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-map-confirm"
            disabled={!selectedCoords || isProcessing || addressDisplay === "Mencari alamat..."}
            onClick={handleConfirm}
          >
            {isProcessing ? "Memproses..." : "Konfirmasi Lokasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
