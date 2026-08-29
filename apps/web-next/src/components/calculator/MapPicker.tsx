"use client";

import { useEffect, useRef, useState } from "react";
import { reverseGeocode } from "@/scripts/geolocation";
import { consumeLocationPickerReason, publishLocationSelection, type LocationPickerReason } from "@/lib/location-selection";
import { showAlert } from "@/utils/alert";
import { loadGoogleMaps } from "@/lib/google-maps-loader";
import { usePresence } from "@/hooks/usePresence";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const DEFAULT_CENTER = { lat: -7.797068, lng: 110.370529 };
const DEFAULT_ZOOM = 13;
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "labels.icon", stylers: [{ saturation: -35 }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f3eadc" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#dfc9aa" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c8dce6" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f8f3e9" }] },
];

interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export function MapPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<LocationPickerReason>("manual");
  const [addressDisplay, setAddressDisplay] = useState("Klik pada peta untuk memilih lokasi...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "empty" | "error">("idle");
  const [mapStatus, setMapStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const presence = usePresence(isOpen, 260);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapsApiRef = useRef<typeof google.maps | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const selectCoordinatesRef = useRef<((lat: number, lng: number, label?: string) => Promise<void>) | null>(null);
  useBodyScrollLock(presence.shouldRender);

  useEffect(() => {
    const openPicker = (nextReason: LocationPickerReason) => {
      consumeLocationPickerReason();
      setReason(nextReason);
      setIsOpen(true);
      setAddressDisplay("Klik pada peta untuk memilih lokasi...");
      setSelectedCoords(null);
      setSearchQuery("");
      setSearchResults([]);
      setSearchStatus("idle");
      setMapStatus("idle");
    };
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: LocationPickerReason }>).detail;
      openPicker(detail?.reason === "outside-diy" ? "outside-diy" : "manual");
    };
    window.addEventListener("open-map-picker", handleOpen);
    const pendingReason = consumeLocationPickerReason();
    if (pendingReason) {
      const timer = window.setTimeout(() => openPicker(pendingReason), 0);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("open-map-picker", handleOpen);
      };
    }
    return () => window.removeEventListener("open-map-picker", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen || searchQuery.trim().length < 3) {
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchStatus("loading");
      try {
        const response = await fetch(`/api/places/search?q=${encodeURIComponent(searchQuery.trim())}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search unavailable");
        const data = await response.json() as { results?: PlaceSearchResult[] };
        const results = Array.isArray(data.results) ? data.results : [];
        setSearchResults(results);
        setSearchStatus(results.length > 0 ? "idle" : "empty");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setSearchResults([]);
        setSearchStatus("error");
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, searchQuery]);

  useEffect(() => {
    if (!presence.shouldRender || !mapContainerRef.current) return;
    let isMounted = true;

    async function initMap() {
      setMapStatus("loading");
      let maps: typeof google.maps;
      try {
        maps = await loadGoogleMaps();
      } catch {
        if (isMounted) setMapStatus("error");
        return;
      }
      if (!isMounted || !mapContainerRef.current) return;
      mapsApiRef.current = maps;
      if (!mapInstanceRef.current) {
        const map = new maps.Map(mapContainerRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          clickableIcons: false,
          styles: MAP_STYLES,
        });
        mapInstanceRef.current = map;

        const updateAddress = async (lat: number, lng: number, label?: string) => {
          setAddressDisplay(label || "Mencari alamat...");
          try {
            const address = await reverseGeocode({ latitude: lat, longitude: lng });
            if (isMounted) setAddressDisplay(address.fullAddress);
          } catch {
            if (isMounted && !label) setAddressDisplay("Tidak dapat mendapatkan alamat");
          }
        };
        const selectCoordinates = async (lat: number, lng: number, label?: string) => {
          if (!isMounted) return;
          setSelectedCoords({ lat, lng });
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          } else {
            markerRef.current = new maps.Marker({
              map,
              position: { lat, lng },
              draggable: true,
              title: "Lokasi sewa",
            });
            markerRef.current.addListener("dragend", async () => {
              const position = markerRef.current?.getPosition();
              if (!position) return;
              const nextLat = position.lat();
              const nextLng = position.lng();
              setSelectedCoords({ lat: nextLat, lng: nextLng });
              await updateAddress(nextLat, nextLng);
            });
          }
          map.panTo({ lat, lng });
          map.setZoom(16);
          await updateAddress(lat, lng, label);
        };
        selectCoordinatesRef.current = selectCoordinates;
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;
          void selectCoordinates(event.latLng.lat(), event.latLng.lng());
        });

        if (reason !== "outside-diy" && navigator.geolocation && window.isSecureContext) {
          navigator.geolocation.getCurrentPosition(
            (position) => void selectCoordinates(position.coords.latitude, position.coords.longitude),
            () => undefined,
          );
        }
      }
      setMapStatus("ready");
    }
    void initMap();
    return () => {
      isMounted = false;
      selectCoordinatesRef.current = null;
      const maps = mapsApiRef.current;
      if (markerRef.current) {
        maps?.event.clearInstanceListeners(markerRef.current);
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) maps?.event.clearInstanceListeners(mapInstanceRef.current);
      mapsApiRef.current = null;
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [presence.shouldRender, reason]);

  const handleClose = () => setIsOpen(false);
  useDialogFocus({ isOpen, onClose: handleClose, containerRef: dialogRef, initialFocusRef: searchInputRef });

  const handleSearchResult = (result: PlaceSearchResult) => {
    setSearchQuery(result.name);
    setSearchResults([]);
    setSearchStatus("idle");
    void selectCoordinatesRef.current?.(result.lat, result.lng, result.address);
  };

  const handleConfirm = async () => {
    if (!selectedCoords) return;
    setIsProcessing(true);
    try {
      const address = await reverseGeocode({ latitude: selectedCoords.lat, longitude: selectedCoords.lng });
      publishLocationSelection({ coords: selectedCoords, address }, "manual");
      handleClose();
    } catch {
      showAlert("Gagal mendapatkan detail alamat untuk lokasi ini.", "Pencarian Lokasi Gagal", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!presence.shouldRender) return null;
  const isOutsidePrompt = reason === "outside-diy";

  return (
    <div className="map-picker-modal active" data-state={presence.state} aria-hidden={!isOpen} inert={!isOpen}>
      <div className="map-picker-overlay" onClick={handleClose}></div>
      <div ref={dialogRef} className="map-picker-content" role="dialog" aria-modal="true" aria-labelledby="map-picker-title" aria-describedby="map-picker-hint" tabIndex={-1}>
        <div className="map-picker-header">
          {isOutsidePrompt && <span className="map-picker-eyebrow">Lokasi sewa berbeda</span>}
          <h3 id="map-picker-title">{isOutsidePrompt ? "Kamu lagi di luar Jogja, ya?" : "Pilih Lokasi Pengantaran"}</h3>
          <p id="map-picker-hint" className="map-picker-hint">
            {isOutsidePrompt ? "Mau lokasi sewanya di mana? Cari hotel, gedung, atau alamat tujuan di DIY." : "Cari nama tempat atau tentukan titik langsung di peta."}
          </p>
        </div>
        <div className="map-picker-search">
          <label htmlFor="map-place-search">Cari lokasi sewa</label>
          <div className="map-picker-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchInputRef}
              id="map-place-search"
              type="search"
              role="combobox"
              value={searchQuery}
              onChange={(event) => {
                const value = event.target.value;
                setSearchQuery(value);
                if (value.trim().length < 3) {
                  setSearchResults([]);
                  setSearchStatus("idle");
                }
              }}
              placeholder="Contoh: Hotel Tentrem, Malioboro"
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls="map-place-results"
              aria-expanded={searchResults.length > 0}
            />
            {searchStatus === "loading" && <span className="map-picker-spinner" aria-label="Mencari lokasi" />}
          </div>
          <div className="map-picker-search-feedback" aria-live="polite">
            {searchStatus === "empty" && "Lokasi tidak ditemukan di DIY. Coba nama atau alamat lain."}
            {searchStatus === "error" && "Pencarian sedang bermasalah. Kamu tetap bisa pilih titik di peta."}
          </div>
          {searchResults.length > 0 && (
            <div id="map-place-results" className="map-picker-results" role="listbox" aria-label="Hasil pencarian lokasi">
              {searchResults.map((result) => (
                <button key={result.id} type="button" role="option" aria-selected="false" onClick={() => handleSearchResult(result)}>
                  <strong>{result.name}</strong><span>{result.address}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="map-picker-map-shell" data-map-provider="google">
          <div className="map-picker-map" ref={mapContainerRef} aria-label="Peta Google untuk memilih lokasi sewa" />
          {mapStatus === "loading" && <div className="map-picker-map-state">Memuat Google Maps...</div>}
          {mapStatus === "error" && (
            <div className="map-picker-map-state error" role="alert">
              Google Maps belum dapat dimuat. Coba tutup lalu buka kembali.
            </div>
          )}
        </div>
        <div className="map-picker-address"><span className="address-text">{addressDisplay}</span></div>
        <div className="map-picker-actions">
          <button type="button" className="btn-map-cancel" onClick={handleClose}>Nanti saja</button>
          <button type="button" className="btn-map-confirm" disabled={!selectedCoords || isProcessing || addressDisplay === "Mencari alamat..."} onClick={handleConfirm}>
            {isProcessing ? "Memproses..." : "Gunakan Lokasi Ini"}
          </button>
        </div>
      </div>
    </div>
  );
}
