'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import type { AddressFields } from '@/components/calculator/types';
import { useAddressDropdown } from '@/components/calculator/useAddressDropdown';
import { SearchableDropdown } from '@/components/calculator/SearchableDropdown';
import { DIY_PROVINCE } from '@/services/nusantarakita-api';
import { getCurrentLocation, reverseGeocode } from '@/scripts/geolocation';
import { config } from '@/data/config';
import { haversineDistance, calculateDeliveryFee } from '@/lib/calculator-logic';
import { showAlert } from '@/utils/alert';
import dynamic from 'next/dynamic';
import '@/components/calculator/styles.css';

const MapPicker = dynamic(() => import('@/components/calculator/MapPicker').then((mod) => mod.MapPicker), { ssr: false });

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

interface StepAddressProps {
  errors: Record<string, string>;
  setErrors: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  onClearError: (field: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAddress({ errors, setErrors, onClearError, onNext, onBack }: StepAddressProps) {
  const { customer, setCustomer, actions } = useCalculatorContext();
  const [isLocating, setIsLocating] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'kota' | 'kecamatan' | 'kelurahan' | null>(null);

  const handleAddressChange = useCallback((updates: Partial<AddressFields>) => {
    setCustomer({
      address: { ...customer.address, ...updates },
    });
    if (updates.street) onClearError('addressStreet');
    if (updates.kota) onClearError('addressKota');
    if (updates.kecamatan) onClearError('addressKecamatan');
    if (updates.kelurahan) onClearError('addressKelurahan');
    if (updates.lat || updates.lng) onClearError('addressLocation');
  }, [customer.address, setCustomer, onClearError]);

  const {
    kotaOptions,
    kecamatanOptions,
    kelurahanOptions,
    isLoadingKota,
    isLoadingKecamatan,
    isLoadingKelurahan,
    kotaKode,
    kecamatanKode,
    kelurahanKode,
    handleKotaChange,
    handleKecamatanChange,
    handleKelurahanChange,
    error: apiError,
  } = useAddressDropdown(customer.address, handleAddressChange);

  // Recalculate delivery fee when coords change
  const addressLat = customer.address.lat;
  const addressLng = customer.address.lng;
  useEffect(() => {
    if (!addressLat || !addressLng) return;
    const latNum = parseFloat(addressLat);
    const lngNum = parseFloat(addressLng);
    if (isNaN(latNum) || isNaN(lngNum)) return;
    const storeLocation = config.storeLocation;
    const distance = haversineDistance(latNum, lngNum, storeLocation.lat, storeLocation.lng);
    const fee = calculateDeliveryFee(distance);
    actions.setDeliveryFee(fee, distance);
  }, [addressLat, addressLng, actions]);

  // Auto-prefill from cached GPS (set by useAutoLocation on homepage)
  const didAutoPrefillRef = useRef(false);
  useEffect(() => {
    if (didAutoPrefillRef.current) return;
    if (customer.address.lat && customer.address.lng) return; // already has location
    const cached = sessionStorage.getItem('sl_auto_location_result');
    if (!cached) return;

    didAutoPrefillRef.current = true;

    void (async () => {
      try {
        const raw: unknown = JSON.parse(cached);
        if (!raw || typeof raw !== 'object' || !('coords' in raw) || !('address' in raw)) return;
        const data = raw as { coords: { lat: number; lng: number }; address: Record<string, string | undefined> };

        const { matchAddressToKode } = await import('@/services/address-matcher');
        const matched = await matchAddressToKode({
          kelurahan: data.address.kelurahan,
          kecamatan: data.address.kecamatan,
          kota: data.address.kota,
          provinsi: data.address.provinsi,
          postcode: data.address.postcode,
        });

        if (!matched.kotaKode) return; // outside service area

        setCustomer({
          address: {
            street: data.address.street || '',
            kelurahan: matched.kelurahan || data.address.kelurahan || '',
            kelurahanKode: matched.kelurahanKode,
            kecamatan: matched.kecamatan || data.address.kecamatan || '',
            kecamatanKode: matched.kecamatanKode,
            kota: matched.kota || data.address.kota || '',
            kotaKode: matched.kotaKode,
            provinsi: data.address.provinsi || 'Daerah Istimewa Yogyakarta',
            provinsiKode: '34',
            zip: matched.zip || data.address.postcode || '',
            lat: data.coords.lat.toString(),
            lng: data.coords.lng.toString(),
          },
        });
        onClearError('addressLocation');
        console.debug('[StepAddress] Auto-prefilled from cached GPS.');
      } catch (e) {
        console.debug('[StepAddress] Auto-prefill failed:', e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for map picker location-selected
  useEffect(() => {
    const handleLocationSelected = async (event: Event) => {
      const detail = (event as CustomEvent<LocationSelectedEventDetail>).detail;
      const { coords, address } = detail;

      const { matchAddressToKode } = await import('@/services/address-matcher');
      const matched = await matchAddressToKode({
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kota: address.kota,
        provinsi: address.provinsi,
        postcode: address.postcode,
      });

      if (!matched.kotaKode) {
        showAlert('Maaf, untuk lokasi pengiriman saat ini hanya melayani wilayah DI Yogyakarta.', 'Lokasi Tidak Mendukung', 'warning');
        return;
      }

      setCustomer({
        address: {
          street: address.street || customer.address.street,
          kelurahan: matched.kelurahan || address.kelurahan || '',
          kelurahanKode: matched.kelurahanKode,
          kecamatan: matched.kecamatan || address.kecamatan || '',
          kecamatanKode: matched.kecamatanKode,
          kota: matched.kota || address.kota || '',
          kotaKode: matched.kotaKode,
          provinsi: address.provinsi || 'Daerah Istimewa Yogyakarta',
          provinsiKode: '34',
          zip: matched.zip || address.postcode || '',
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
        },
      });
      onClearError('addressLocation');
    };

    window.addEventListener('location-selected', handleLocationSelected);
    return () => window.removeEventListener('location-selected', handleLocationSelected);
  }, [customer.address.street, setCustomer, onClearError]);

  const handleLocationClick = async () => {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      showAlert('Geolocation memerlukan koneksi aman (HTTPS).', 'Koneksi Tidak Aman', 'error');
      return;
    }

    setIsLocating(true);
    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords);

      const { matchAddressToKode } = await import('@/services/address-matcher');
      const matched = await matchAddressToKode({
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kota: address.kota,
        provinsi: address.provinsi,
        postcode: address.postcode,
      });

      if (!matched.kotaKode) {
        throw new Error('Maaf, untuk lokasi pengiriman saat ini hanya melayani wilayah DI Yogyakarta.');
      }

      setCustomer({
        address: {
          ...customer.address,
          street: address.street || customer.address.street,
          kelurahan: matched.kelurahan || address.kelurahan || '',
          kelurahanKode: matched.kelurahanKode,
          kecamatan: matched.kecamatan || address.kecamatan || '',
          kecamatanKode: matched.kecamatanKode,
          kota: matched.kota || address.kota || '',
          kotaKode: matched.kotaKode,
          provinsi: address.provinsi || 'DI Yogyakarta',
          provinsiKode: '34',
          zip: matched.zip || address.postcode || '',
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
        },
      });
      onClearError('addressLocation');
    } catch (error) {
      const msg = (error as Error).message || 'Gagal mendapatkan lokasi';
      showAlert(`Pencarian Lokasi Gagal: ${msg}`, 'Gagal', 'error');
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapPickerClick = () => {
    window.dispatchEvent(new CustomEvent('open-map-picker'));
  };

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customer.address.street.trim()) newErrors.addressStreet = 'Alamat jalan wajib diisi';
    if (!customer.address.kecamatan.trim()) newErrors.addressKecamatan = 'Kecamatan wajib diisi';
    if (!customer.address.kota.trim()) newErrors.addressKota = 'Kabupaten/Kota wajib diisi';
    if (!customer.address.lat || !customer.address.lng) {
      newErrors.addressLocation = "Lokasi wajib dipilih untuk menghitung ongkir. Gunakan tombol 'Pilih di Peta' atau 'Lokasi Saya'.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
    return true;
  }, [customer.address, setErrors]);

  const handleNext = () => {
    if (validate()) onNext();
  };

  // Dropdown options
  const kotaDropdownOptions = kotaOptions.map((item) => ({ value: item.kode, label: item.nama }));
  const kecamatanDropdownOptions = kecamatanOptions.map((item) => ({ value: item.kode, label: item.nama }));
  const kelurahanDropdownOptions = kelurahanOptions.map((item) => ({ value: item.kode, label: item.nama }));

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">📍 Alamat Pengiriman</h2>
      <p className="wizard-step-subtitle">Ke mana kasur diantar?</p>

      {/* Location buttons */}
      <div className="wizard-location-buttons">
        <button type="button" onClick={handleLocationClick} disabled={isLocating} className="wizard-location-btn">
          {isLocating ? '⏳ Mencari...' : '📍 Lokasi Saya'}
        </button>
        <button type="button" onClick={handleMapPickerClick} className="wizard-location-btn secondary">
          🗺️ Pilih di Peta
        </button>
      </div>
      {errors.addressLocation && <p className="wizard-error">{errors.addressLocation}</p>}

      {/* Delivery fee badge */}
      {actions.state.deliveryFee > 0 && (
        <div className="wizard-info-box">
          🚚 Ongkir: <strong>Rp{new Intl.NumberFormat('id-ID').format(actions.state.deliveryFee)}</strong>
          {actions.state.distance > 0 && <span> ({actions.state.distance.toFixed(1)} km)</span>}
        </div>
      )}

      {/* Street */}
      <div className="wizard-field">
        <label htmlFor="w-street" className="wizard-label">Alamat Jalan</label>
        <input
          type="text"
          id="w-street"
          placeholder="Nama jalan, nomor rumah, RT/RW"
          value={customer.address.street}
          onChange={(e) => handleAddressChange({ street: e.target.value })}
          className={`wizard-input ${errors.addressStreet ? 'error' : ''}`}
          autoComplete="street-address"
          suppressHydrationWarning
        />
        {errors.addressStreet && <p className="wizard-error">{errors.addressStreet}</p>}
      </div>

      {apiError && <p className="wizard-error">{apiError}</p>}

      {/* Kota + Kecamatan */}
      <div className="wizard-field-row">
        <div className="wizard-field">
          <label htmlFor="w-kota" className="wizard-label">Kabupaten/Kota</label>
          <SearchableDropdown
            id="w-kota"
            options={kotaDropdownOptions}
            value={kotaKode}
            onChange={(v) => { handleKotaChange(v); setTimeout(() => setOpenDropdown('kecamatan'), 300); }}
            placeholder="Pilih Kab/Kota"
            loading={isLoadingKota}
            error={!!errors.addressKota}
            isOpen={openDropdown === 'kota'}
            onOpenChange={(open) => setOpenDropdown(open ? 'kota' : null)}
          />
          {errors.addressKota && <p className="wizard-error">{errors.addressKota}</p>}
        </div>
        <div className="wizard-field">
          <label htmlFor="w-kecamatan" className="wizard-label">Kecamatan</label>
          <SearchableDropdown
            id="w-kecamatan"
            options={kecamatanDropdownOptions}
            value={kecamatanKode}
            onChange={(v) => { handleKecamatanChange(v); setTimeout(() => setOpenDropdown('kelurahan'), 300); }}
            placeholder={!kotaKode ? 'Pilih Kab/Kota dulu' : 'Pilih Kecamatan'}
            disabled={!kotaKode}
            loading={isLoadingKecamatan}
            error={!!errors.addressKecamatan}
            isOpen={openDropdown === 'kecamatan'}
            onOpenChange={(open) => setOpenDropdown(open ? 'kecamatan' : null)}
          />
          {errors.addressKecamatan && <p className="wizard-error">{errors.addressKecamatan}</p>}
        </div>
      </div>

      {/* Kelurahan + Kode Pos */}
      <div className="wizard-field-row">
        <div className="wizard-field">
          <label htmlFor="w-kelurahan" className="wizard-label">Kelurahan</label>
          <SearchableDropdown
            id="w-kelurahan"
            options={kelurahanDropdownOptions}
            value={kelurahanKode}
            onChange={(v) => { handleKelurahanChange(v); setOpenDropdown(null); }}
            placeholder={!kecamatanKode ? 'Pilih Kecamatan dulu' : 'Pilih Kelurahan'}
            disabled={!kecamatanKode}
            loading={isLoadingKelurahan}
            error={!!errors.addressKelurahan}
            isOpen={openDropdown === 'kelurahan'}
            onOpenChange={(open) => setOpenDropdown(open ? 'kelurahan' : null)}
          />
        </div>
        <div className="wizard-field">
          <label htmlFor="w-zip" className="wizard-label">Kode Pos</label>
          <input type="text" id="w-zip" value={customer.address.zip} readOnly disabled className="wizard-input" style={{ background: '#f1f5f9', color: '#94a3b8' }} suppressHydrationWarning />
        </div>
      </div>

      {/* Provinsi (locked) */}
      <div className="wizard-field">
        <label htmlFor="w-provinsi" className="wizard-label">Provinsi</label>
        <SearchableDropdown
          id="w-provinsi"
          options={[{ value: DIY_PROVINCE.kode, label: DIY_PROVINCE.nama }]}
          value={DIY_PROVINCE.kode}
          onChange={() => {}}
          disabled
        />
      </div>

      {/* Notes */}
      <div className="wizard-field">
        <label htmlFor="w-notes" className="wizard-label">Catatan (opsional)</label>
        <textarea
          id="w-notes"
          placeholder="Permintaan khusus, jam antar, dll"
          value={customer.notes}
          onChange={(e) => setCustomer({ notes: e.target.value })}
          rows={3}
          className="wizard-input"
          style={{ resize: 'vertical', minHeight: '60px' }}
          suppressHydrationWarning
        />
      </div>

      <div className="wizard-btn-row">
        <button type="button" onClick={onBack} className="wizard-back-btn-bottom">
          ← Kembali
        </button>
        <button type="button" onClick={handleNext} className="wizard-next-btn">
          Lanjutkan →
        </button>
      </div>

      <MapPicker />
    </div>
  );
}
