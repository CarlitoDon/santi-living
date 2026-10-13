'use client';

import { useState, type FormEvent } from 'react';
import { getAttributionEventParams } from '@/lib/attribution';

interface LeadTrackResponse {
  eventId?: string;
  cityClassification?: string;
}

const WA_NUMBER = '6289519119092';

const CHAIR_OPTIONS = [
  'Kursi Plastik Sandaran',
  'Kursi Lipat Besi (Chitose)',
  'Kursi Susun Spons (Futura)',
  'Belum Yakin — Minta Rekomendasi',
] as const;

const QUANTITY_OPTIONS = [
  '20–50 Unit',
  '50–100 Unit',
  '100–200 Unit',
  'Lebih dari 200 Unit',
] as const;

function buildWaMessage(input: {
  nama: string;
  whatsapp: string;
  jenis: string;
  jumlah: string;
  area: string;
  tanggal: string;
  catatan: string;
}): string {
  return [
    'Halo Santi Living, saya ingin konfirmasi sewa kursi plastik Jogja dari form website:',
    '',
    `• Nama: ${input.nama}`,
    `• No WhatsApp: ${input.whatsapp}`,
    `• Jenis Kursi: ${input.jenis}`,
    `• Jumlah: ${input.jumlah}`,
    `• Lokasi Kirim: ${input.area}`,
    `• Tanggal Acara: ${input.tanggal}`,
    `• Catatan: ${input.catatan || '-'}`,
    '',
    'Mohon info ketersediaan stok dan total biayanya. Terima kasih!',
  ].join('\n');
}

export function ChairLeadForm() {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [jenis, setJenis] = useState<string>(CHAIR_OPTIONS[0]);
  const [jumlah, setJumlah] = useState<string>(QUANTITY_OPTIONS[1]);
  const [area, setArea] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [waUrl, setWaUrl] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    const cleanNama = nama.trim();
    const cleanWa = whatsapp.replace(/[^\d+]/g, '');
    const digitCount = cleanWa.replace(/\D/g, '').length;
    const cleanArea = area.trim();
    const cleanTanggal = tanggal.trim();

    if (!cleanNama) {
      setError('Mohon isi nama lengkap Anda.');
      return;
    }
    if (digitCount < 9) {
      setError('Nomor WhatsApp minimal 9 digit angka.');
      return;
    }
    if (!cleanArea) {
      setError('Mohon isi alamat / area pengantaran di Jogja.');
      return;
    }
    if (!cleanTanggal) {
      setError('Mohon isi tanggal acara / pemakaian.');
      return;
    }

    setError(null);
    setStatus('submitting');

    try {
      const attr = getAttributionEventParams();
      const leadContent = `Nama: ${cleanNama} | WA: ${cleanWa} | Kursi: ${jenis} | Jml: ${jumlah} | Area: ${cleanArea} | Tgl: ${cleanTanggal}${catatan.trim() ? ` | Catatan: ${catatan.trim()}` : ''}`;
      const res = await fetch('/api/lead/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'form_submit',
          source: attr.source || 'isolated_lp_kursi',
          medium: attr.medium || 'landing_page',
          campaign: attr.campaign,
          term: attr.term,
          content: leadContent,
          gclid: attr.gclid,
          wbraid: attr.wbraid,
          gbraid: attr.gbraid,
          fbclid: attr.fbclid,
          cta_source: 'chair_order_form',
          product_category: 'sewa-kursi',
          page_type: 'isolated_landing_page',
          intent: 'sewa_kursi_plastik_jogja',
          landing_page: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
          city: cleanArea || undefined,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
          timestamp: new Date().toISOString(),
        }),
      });
      const resData = (await res.json().catch(() => ({}))) as LeadTrackResponse;
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit', {
          event_id: resData.eventId,
          source: attr.source || 'isolated_lp_kursi',
          medium: attr.medium || 'landing_page',
          campaign: attr.campaign,
          city_classification: resData.cityClassification,
        });
        if (resData.cityClassification === 'service_area') {
          window.gtag('event', 'santi_whatsapp_qualified', {
            event_id: resData.eventId,
            city_classification: resData.cityClassification,
            persistence_status: 'confirmed',
          });
          window.gtag('event', 'conversion', {
            send_to: 'AW-17865321955/y7bwCKTm3J0cEOPb7MZC',
            event_id: resData.eventId,
            transport_type: 'beacon',
          });
        }
      }
    } catch {
      // Best-effort tracking: tetap lanjutkan ke WhatsApp walau gagal.
    }

    const message = buildWaMessage({
      nama: cleanNama,
      whatsapp: cleanWa,
      jenis,
      jumlah,
      area: cleanArea,
      tanggal: cleanTanggal,
      catatan: catatan.trim(),
    });
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    setWaUrl(url);
    setStatus('success');
    window.setTimeout(() => {
      window.location.href = url;
    }, 900);
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-800';

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Form pemesanan sewa kursi">
      <div className="grid gap-4">
        <div>
          <label htmlFor="chair-nama" className={labelClass}>
            Nama Lengkap
          </label>
          <input
            id="chair-nama"
            name="nama"
            type="text"
            autoComplete="name"
            required
            placeholder="cth: Budi Santoso"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="chair-wa" className={labelClass}>
            Nomor WhatsApp
          </label>
          <input
            id="chair-wa"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="cth: 0812xxxxxxx"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="chair-jenis" className={labelClass}>
              Pilihan Kursi
            </label>
            <select
              id="chair-jenis"
              name="jenis"
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className={inputClass}
            >
              {CHAIR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="chair-jumlah" className={labelClass}>
              Jumlah Kursi
            </label>
            <select
              id="chair-jumlah"
              name="jumlah"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className={inputClass}
            >
              {QUANTITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="chair-area" className={labelClass}>
            Alamat / Area Pengantaran di Jogja
          </label>
          <input
            id="chair-area"
            name="area"
            type="text"
            autoComplete="street-address"
            required
            placeholder="cth: Kasihan Bantul / Depok Sleman / Umbulharjo"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="chair-tanggal" className={labelClass}>
            Tanggal Acara / Pemakaian
          </label>
          <input
            id="chair-tanggal"
            name="tanggal"
            type="text"
            required
            placeholder="cth: Sabtu, 18 Okt 2026"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="chair-catatan" className={labelClass}>
            Catatan Tambahan <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <textarea
            id="chair-catatan"
            name="catatan"
            rows={3}
            placeholder="cth: Butuh antar jam 07.00, akses gang sempit…"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {status === 'success' ? (
          <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
            Data Anda berhasil dicatat! Mengalihkan ke WhatsApp...
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status !== 'idle'}
          className="w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'submitting'
            ? 'Mengirim…'
            : status === 'success'
              ? 'Terkirim — Membuka WhatsApp…'
              : 'Kirim Permintaan & Dapatkan Rekap Harga (WhatsApp)'}
        </button>

        {status === 'success' && waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border-2 border-green-600 px-6 py-3 text-center text-base font-bold text-green-700 transition hover:bg-green-50"
          >
            Klik di sini jika WhatsApp tidak terbuka otomatis
          </a>
        ) : null}
      </div>
    </form>
  );
}
