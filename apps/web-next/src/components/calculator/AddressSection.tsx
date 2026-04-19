/**
 * AddressSection Component - matches original Calculator.astro styling
 * Updated with searchable dropdowns for Provinsi → Kab/Kota → Kecamatan → Kelurahan
 */

import { useState } from "react";
import type { AddressFields, CustomerData } from "./types";
import { useAddressDropdown } from "./useAddressDropdown";
import { SearchableDropdown } from "./SearchableDropdown";
import { DIY_PROVINCE } from "@/services/nusantarakita-api";
import "./styles.css";

interface AddressSectionProps {
  customer: CustomerData;
  onChange: (updates: Partial<CustomerData>) => void;
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  onLocationClick: () => void;
  onMapPickerClick: () => void;
}

export function AddressSection({
  customer,
  onChange,
  errors,
  onClearError,
  onLocationClick,
  onMapPickerClick,
}: AddressSectionProps) {
  const [isLocating, setIsLocating] = useState(false);
  // Track which dropdown is currently open for cascading behavior
  const [openDropdown, setOpenDropdown] = useState<
    "kota" | "kecamatan" | "kelurahan" | null
  >(null);

  const handleAddressChange = (updates: Partial<AddressFields>) => {
    onChange({
      address: {
        ...customer.address,
        ...updates,
      },
    });
    // Clear relevant errors
    if (updates.street) onClearError("addressStreet");
    if (updates.kota) onClearError("addressKota");
    if (updates.kelurahan) onClearError("addressKelurahan");
    if (updates.kecamatan) onClearError("addressKecamatan");
    if (updates.lat || updates.lng) onClearError("addressLocation");
  };

  // Use the address dropdown hook
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

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ notes: e.target.value });
  };

  const handleLocationClick = async () => {
    setIsLocating(true);
    try {
      onLocationClick();
    } finally {
      setIsLocating(false);
    }
  };

  // Convert WilayahItem to DropdownOption
  const kotaDropdownOptions = kotaOptions.map((item) => ({
    value: item.kode,
    label: item.nama,
  }));

  const kecamatanDropdownOptions = kecamatanOptions.map((item) => ({
    value: item.kode,
    label: item.nama,
  }));

  const kelurahanDropdownOptions = kelurahanOptions.map((item) => ({
    value: item.kode,
    label: item.nama,
  }));

  // Cascade handlers - auto-open next dropdown after selection
  const handleKotaSelect = (value: string) => {
    handleKotaChange(value);
    // Open kecamatan dropdown after short delay for data to load
    setTimeout(() => setOpenDropdown("kecamatan"), 300);
  };

  const handleKecamatanSelect = (value: string) => {
    handleKecamatanChange(value);
    // Open kelurahan dropdown after short delay
    setTimeout(() => setOpenDropdown("kelurahan"), 300);
  };

  const handleKelurahanSelect = (value: string) => {
    handleKelurahanChange(value);
    setOpenDropdown(null);
  };

  return (
    <div className="calc-form-section" style={{ borderBottom: "none" }}>
      {/* Section Header */}
      <div className="calc-section-header">
        <span className="calc-section-number">4</span>
        <span className="calc-section-title">Alamat Pengantaran</span>
      </div>

      {/* Street Address */}
      <div className="calc-form-group">
        <label htmlFor="addressStreet" className="calc-form-label">
          Alamat Jalan
        </label>
        <input
          type="text"
          id="addressStreet"
          placeholder="Nama jalan, nomor rumah, RT/RW"
          value={customer.address.street}
          onChange={(e) => handleAddressChange({ street: e.target.value })}
          className={`calc-form-input ${errors.addressStreet ? "error" : ""}`}
          suppressHydrationWarning
        />
        {errors.addressStreet && (
          <p className="calc-error-message">{errors.addressStreet}</p>
        )}
      </div>

      {/* Location Buttons */}
      <div id="location-buttons" className="calc-location-buttons">
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocating}
          className={`calc-btn-location ${errors.addressLocation ? "pulse-error" : ""}`}
        >
          {isLocating ? "⏳ Mencari..." : "📍 Gunakan Lokasi Sekarang"}
        </button>
        <button
          type="button"
          onClick={onMapPickerClick}
          className={`calc-btn-location secondary ${errors.addressLocation ? "pulse-error" : ""}`}
        >
          🗺️ Pilih di Peta
        </button>
      </div>
      {errors.addressLocation && (
        <p className="calc-error-message" style={{ marginTop: "0.5rem" }}>
          {errors.addressLocation}
        </p>
      )}

      {/* API Error */}
      {apiError && (
        <p className="calc-error-message" style={{ marginTop: "0.5rem" }}>
          {apiError}
        </p>
      )}

      {/* Row 1: Provinsi + Kabupaten/Kota */}
      <div className="calc-form-row" style={{ marginBottom: "1rem" }}>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressProvinsi" className="calc-form-label">
            Provinsi
          </label>
          <SearchableDropdown
            id="addressProvinsi"
            options={[{ value: DIY_PROVINCE.kode, label: DIY_PROVINCE.nama }]}
            value={DIY_PROVINCE.kode}
            onChange={() => {}}
            disabled
          />
        </div>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressKota" className="calc-form-label">
            Kabupaten/Kota
          </label>
          <SearchableDropdown
            id="addressKota"
            options={kotaDropdownOptions}
            value={kotaKode}
            onChange={handleKotaSelect}
            placeholder="Pilih Kabupaten/Kota"
            loading={isLoadingKota}
            error={!!errors.addressKota}
            isOpen={openDropdown === "kota"}
            onOpenChange={(open) => setOpenDropdown(open ? "kota" : null)}
          />
          {errors.addressKota && (
            <p className="calc-error-message">{errors.addressKota}</p>
          )}
        </div>
      </div>

      {/* Row 2: Kecamatan + Kelurahan */}
      <div className="calc-form-row" style={{ marginBottom: "1rem" }}>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressKecamatan" className="calc-form-label">
            Kecamatan
          </label>
          <SearchableDropdown
            id="addressKecamatan"
            options={kecamatanDropdownOptions}
            value={kecamatanKode}
            onChange={handleKecamatanSelect}
            placeholder={!kotaKode ? "Pilih Kab/Kota dulu" : "Pilih Kecamatan"}
            disabled={!kotaKode}
            loading={isLoadingKecamatan}
            error={!!errors.addressKecamatan}
            isOpen={openDropdown === "kecamatan"}
            onOpenChange={(open) => setOpenDropdown(open ? "kecamatan" : null)}
          />
          {errors.addressKecamatan && (
            <p className="calc-error-message">{errors.addressKecamatan}</p>
          )}
        </div>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressKelurahan" className="calc-form-label">
            Kelurahan/Desa
          </label>
          <SearchableDropdown
            id="addressKelurahan"
            options={kelurahanDropdownOptions}
            value={kelurahanKode}
            onChange={handleKelurahanSelect}
            placeholder={
              !kecamatanKode ? "Pilih Kecamatan dulu" : "Pilih Kelurahan"
            }
            disabled={!kecamatanKode}
            loading={isLoadingKelurahan}
            error={!!errors.addressKelurahan}
            isOpen={openDropdown === "kelurahan"}
            onOpenChange={(open) => setOpenDropdown(open ? "kelurahan" : null)}
          />
          {errors.addressKelurahan && (
            <p className="calc-error-message">{errors.addressKelurahan}</p>
          )}
        </div>
      </div>

      {/* Kode Pos - Disabled */}
      <div className="calc-form-group">
        <label htmlFor="addressZip" className="calc-form-label">
          Kode Pos
        </label>
        <input
          type="text"
          id="addressZip"
          placeholder="Otomatis dari kelurahan"
          value={customer.address.zip}
          readOnly
          disabled
          className="calc-form-input"
          style={{ maxWidth: "150px", background: "#f8fafc", color: "#64748b" }}
          suppressHydrationWarning
        />
      </div>

      {/* Latitude & Longitude - Disabled */}
      <div className="calc-form-row" style={{ marginBottom: "1rem" }}>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressLat" className="calc-form-label">
            Latitude
          </label>
          <input
            type="text"
            id="addressLat"
            placeholder="Otomatis"
            value={customer.address.lat}
            readOnly
            disabled
            className={`calc-form-input ${errors.addressLocation ? "error" : ""}`}
            style={{
              background: errors.addressLocation ? "#fef2f2" : "#f8fafc",
              color: errors.addressLocation ? "#dc2626" : "#64748b",
            }}
            suppressHydrationWarning
          />
        </div>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressLng" className="calc-form-label">
            Longitude
          </label>
          <input
            type="text"
            id="addressLng"
            placeholder="Otomatis"
            value={customer.address.lng}
            readOnly
            disabled
            className={`calc-form-input ${errors.addressLocation ? "error" : ""}`}
            style={{
              background: errors.addressLocation ? "#fef2f2" : "#f8fafc",
              color: errors.addressLocation ? "#dc2626" : "#64748b",
            }}
            suppressHydrationWarning
          />
        </div>
      </div>

      {/* Notes */}
      <div className="calc-form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="customerNotes" className="calc-form-label">
          Catatan (opsional)
        </label>
        <textarea
          id="customerNotes"
          placeholder="Permintaan khusus, jam antar, dll"
          value={customer.notes}
          onChange={handleNotesChange}
          rows={3}
          className="calc-form-textarea"
          suppressHydrationWarning
        />
      </div>
    </div>
  );
}
