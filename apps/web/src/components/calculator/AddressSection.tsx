/**
 * AddressSection Component - matches original Calculator.astro styling
 */

import { useState } from "react";
import type { AddressFields, CustomerData } from "./types";
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

  const handleAddressChange = (field: keyof AddressFields, value: string) => {
    onChange({
      address: {
        ...customer.address,
        [field]: value,
      },
    });
    if (field === "street" && value.trim()) {
      onClearError("addressStreet");
    }
    if (field === "kota" && value.trim()) {
      onClearError("addressKota");
    }
  };

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
          onChange={(e) => handleAddressChange("street", e.target.value)}
          className={`calc-form-input ${errors.addressStreet ? "error" : ""}`}
        />
        {errors.addressStreet && (
          <p className="calc-error-message">{errors.addressStreet}</p>
        )}
      </div>

      {/* Location Buttons */}
      <div className="calc-location-buttons">
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocating}
          className="calc-btn-location"
        >
          {isLocating ? "⏳ Mencari..." : "📍 Gunakan Lokasi Sekarang"}
        </button>
        <button
          type="button"
          onClick={onMapPickerClick}
          className="calc-btn-location secondary"
        >
          🗺️ Pilih di Peta
        </button>
      </div>

      {/* Two Column Row */}
      <div className="calc-form-row" style={{ marginBottom: "1rem" }}>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressKelurahan" className="calc-form-label">
            Kelurahan/Desa
          </label>
          <input
            type="text"
            id="addressKelurahan"
            placeholder="Kelurahan"
            value={customer.address.kelurahan}
            onChange={(e) => handleAddressChange("kelurahan", e.target.value)}
            className={`calc-form-input ${errors.addressKelurahan ? "error" : ""}`}
          />
          {errors.addressKelurahan && (
            <p className="calc-error-message">{errors.addressKelurahan}</p>
          )}
        </div>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressKecamatan" className="calc-form-label">
            Kecamatan
          </label>
          <input
            type="text"
            id="addressKecamatan"
            placeholder="Kecamatan"
            value={customer.address.kecamatan}
            onChange={(e) => handleAddressChange("kecamatan", e.target.value)}
            className={`calc-form-input ${errors.addressKecamatan ? "error" : ""}`}
          />
          {errors.addressKecamatan && (
            <p className="calc-error-message">{errors.addressKecamatan}</p>
          )}
        </div>
      </div>

      {/* Two Column Row */}
      <div className="calc-form-row" style={{ marginBottom: "1rem" }}>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressKota" className="calc-form-label">
            Kabupaten/Kota
          </label>
          <input
            type="text"
            id="addressKota"
            placeholder="Sleman, Bantul, dll"
            value={customer.address.kota}
            onChange={(e) => handleAddressChange("kota", e.target.value)}
            className={`calc-form-input ${errors.addressKota ? "error" : ""}`}
          />
          {errors.addressKota && (
            <p className="calc-error-message">{errors.addressKota}</p>
          )}
        </div>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressProvinsi" className="calc-form-label">
            Provinsi
          </label>
          <input
            type="text"
            id="addressProvinsi"
            value={customer.address.provinsi}
            readOnly
            className="calc-form-input"
            style={{ background: "#f8fafc", color: "#64748b" }}
          />
        </div>
      </div>
      {/* Kode Pos */}
      <div className="calc-form-group">
        <label htmlFor="addressZip" className="calc-form-label">
          Kode Pos
        </label>
        <input
          type="text"
          id="addressZip"
          placeholder="55xxx"
          value={customer.address.zip}
          onChange={(e) => handleAddressChange("zip", e.target.value)}
          className={`calc-form-input ${errors.addressZip ? "error" : ""}`}
          style={{ maxWidth: "150px" }}
        />
        {errors.addressZip && (
          <p className="calc-error-message">{errors.addressZip}</p>
        )}
      </div>

      {/* Latitude & Longitude */}
      <div className="calc-form-row" style={{ marginBottom: "1rem" }}>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressLat" className="calc-form-label">
            Latitude
          </label>
          <input
            type="text"
            id="addressLat"
            placeholder="Otomatis dari GPS"
            value={customer.address.lat}
            readOnly
            className="calc-form-input"
            style={{ background: "#f8fafc", color: "#64748b" }}
          />
        </div>
        <div className="calc-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="addressLng" className="calc-form-label">
            Longitude
          </label>
          <input
            type="text"
            id="addressLng"
            placeholder="Otomatis dari GPS"
            value={customer.address.lng}
            readOnly
            className="calc-form-input"
            style={{ background: "#f8fafc", color: "#64748b" }}
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
        />
      </div>
    </div>
  );
}
