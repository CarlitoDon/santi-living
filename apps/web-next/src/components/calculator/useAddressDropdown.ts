/**
 * useAddressDropdown Hook
 * Manages cascading dropdown state for Provinsi → Kab/Kota → Kecamatan → Kelurahan
 */

import { useState, useEffect, useCallback } from "react";
import {
  getKabupatenKota,
  getKecamatan,
  getKelurahan,
  DIY_PROVINCE,
  type WilayahItem,
} from "@/services/nusantarakita-api";
import type { AddressFields } from "./types";

interface AddressDropdownState {
  // Options lists
  kotaOptions: WilayahItem[];
  kecamatanOptions: WilayahItem[];
  kelurahanOptions: WilayahItem[];

  // Loading states
  isLoadingKota: boolean;
  isLoadingKecamatan: boolean;
  isLoadingKelurahan: boolean;

  // Error states
  error: string | null;
}

interface UseAddressDropdownReturn extends AddressDropdownState {
  // Selected codes (derived from address)
  provinsiKode: string;
  kotaKode: string;
  kecamatanKode: string;
  kelurahanKode: string;

  // Handlers
  handleKotaChange: (kode: string) => void;
  handleKecamatanChange: (kode: string) => void;
  handleKelurahanChange: (kode: string) => void;
}

export function useAddressDropdown(
  currentAddress: AddressFields,
  onAddressChange: (updates: Partial<AddressFields>) => void,
): UseAddressDropdownReturn {
  const [state, setState] = useState<AddressDropdownState>({
    kotaOptions: [],
    kecamatanOptions: [],
    kelurahanOptions: [],
    isLoadingKota: false,
    isLoadingKecamatan: false,
    isLoadingKelurahan: false,
    error: null,
  });

  // Extract codes from address (with fallback to empty)
  const provinsiKode = currentAddress.provinsiKode || DIY_PROVINCE.kode;
  const kotaKode = currentAddress.kotaKode || "";
  const kecamatanKode = currentAddress.kecamatanKode || "";
  const kelurahanKode = currentAddress.kelurahanKode || "";

  // Load Kab/Kota on mount
  useEffect(() => {
    async function loadKota() {
      setState((prev) => ({ ...prev, isLoadingKota: true, error: null }));
      try {
        const data = await getKabupatenKota();
        setState((prev) => ({
          ...prev,
          kotaOptions: data,
          isLoadingKota: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoadingKota: false,
          error: "Gagal memuat data Kabupaten/Kota",
        }));
        console.error("Failed to load kab/kota:", err);
      }
    }
    loadKota();
  }, []);

  // Load Kecamatan when Kota changes
  useEffect(() => {
    if (!kotaKode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing downstream options when parent code is empty
      setState((prev) => ({
        ...prev,
        kecamatanOptions: [],
        kelurahanOptions: [],
      }));
      return;
    }

    async function loadKecamatan() {
      setState((prev) => ({
        ...prev,
        isLoadingKecamatan: true,
        kecamatanOptions: [],
        kelurahanOptions: [],
        error: null,
      }));
      try {
        const data = await getKecamatan(kotaKode);
        setState((prev) => ({
          ...prev,
          kecamatanOptions: data,
          isLoadingKecamatan: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoadingKecamatan: false,
          error: "Gagal memuat data Kecamatan",
        }));
        console.error("Failed to load kecamatan:", err);
      }
    }
    loadKecamatan();
  }, [kotaKode]);

  // Load Kelurahan when Kecamatan changes
  useEffect(() => {
    if (!kecamatanKode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing downstream options when parent code is empty
      setState((prev) => ({ ...prev, kelurahanOptions: [] }));
      return;
    }

    async function loadKelurahan() {
      setState((prev) => ({
        ...prev,
        isLoadingKelurahan: true,
        kelurahanOptions: [],
        error: null,
      }));
      try {
        const data = await getKelurahan(kecamatanKode);
        setState((prev) => ({
          ...prev,
          kelurahanOptions: data,
          isLoadingKelurahan: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoadingKelurahan: false,
          error: "Gagal memuat data Kelurahan",
        }));
        console.error("Failed to load kelurahan:", err);
      }
    }
    loadKelurahan();
  }, [kecamatanKode]);

  // Handler: Kab/Kota changed
  const handleKotaChange = useCallback(
    (kode: string) => {
      const selected = state.kotaOptions.find((item) => item.kode === kode);
      if (!selected) return;

      // Update address with kota info and reset downstream
      onAddressChange({
        kota: selected.nama,
        kotaKode: selected.kode,
        kecamatan: "",
        kecamatanKode: "",
        kelurahan: "",
        kelurahanKode: "",
        zip: "",
        lat: String(selected.lat),
        lng: String(selected.lng),
      });
    },
    [state.kotaOptions, onAddressChange],
  );

  // Handler: Kecamatan changed
  const handleKecamatanChange = useCallback(
    (kode: string) => {
      const selected = state.kecamatanOptions.find(
        (item) => item.kode === kode,
      );
      if (!selected) return;

      // Update address with kecamatan info and reset downstream
      onAddressChange({
        kecamatan: selected.nama,
        kecamatanKode: selected.kode,
        kelurahan: "",
        kelurahanKode: "",
        zip: "",
        lat: String(selected.lat),
        lng: String(selected.lng),
      });
    },
    [state.kecamatanOptions, onAddressChange],
  );

  // Handler: Kelurahan changed
  const handleKelurahanChange = useCallback(
    (kode: string) => {
      const selected = state.kelurahanOptions.find(
        (item) => item.kode === kode,
      );
      if (!selected) return;

      // Update address with kelurahan info including kode_pos
      onAddressChange({
        kelurahan: selected.nama,
        kelurahanKode: selected.kode,
        zip: selected.kode_pos || "",
        lat: String(selected.lat),
        lng: String(selected.lng),
      });
    },
    [state.kelurahanOptions, onAddressChange],
  );

  return {
    ...state,
    provinsiKode,
    kotaKode,
    kecamatanKode,
    kelurahanKode,
    handleKotaChange,
    handleKecamatanChange,
    handleKelurahanChange,
  };
}
