'use client';

import { useState, type FormEvent } from 'react';
import { getAttributionEventParams } from '@/lib/attribution';

const WA_NUMBER = '6289519119092';

const PACKAGE_OPTIONS = [
  'Paket Lengkap Single (90x200 / 100x200)',
  'Paket Lengkap Double (120x200)',
  'Paket Lengkap Queen (160x200)',
  'Paket Lengkap King (180x200)',
  'Kasur Busa Saja (Tanpa Bedding)',
  'Sewa Bulanan Kost',
] as const;

const QUANTITY_OPTIONS = [
  '1 Unit',
  '2 Unit',
  '3–5 Unit (Diskon 10%)',
  '6+ Unit (Diskon 15%)',
] as const;

const DURATION_OPTIONS = [
  '1–2 Malam',
  '3–6 Malam',
  '1 Minggu+',
  '1 Bulan',
] as const;

interface LeadTrackResponse {
  eventId?: string;
  cityClassification?: string;
}

export function MattressLeadForm() {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paket, setPaket] = useState<string>(PACKAGE_OPTIONS[0]);
  const [jumlah, setJumlah] = useState<string>(QUANTITY_OPTIONS[0]);
  const [durasi, setDurasi] = useState<string>(DURATION_OPTIONS[0]);
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
      setError('Mohon isi alamat / area pengantaran di Jogja (Sleman, Kota Jogja, Bantul, Kulon Progo).');
      return;
    }
    if (!cleanTanggal) {
      setError('Mohon isi tanggal mulai sewa kasur.');
      return;
    }

    setError(null);
    setStatus('submitting');

    try {
      const attr = getAttributionEventParams();
      const leadContent = `Nama: ${cleanNama} | WA: ${cleanWa} | Paket: ${paket} | Jml: ${jumlah} | Durasi: ${durasi} | Area: ${cleanArea} | Tgl: ${cleanTanggal}${catatan.trim() ? ` | Catatan: ${catatan.trim()}` : ''}`;
      const res = await fetch('/api/lead/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'form_submit',
          source: attr.source || 'isolated_lp_kasur',
          medium: attr.medium || 'landing_page',
          campaign: attr.campaign,
          term: attr.term,
          content: leadContent,
          gclid: attr.gclid,
          wbraid: attr.wbraid,
          gbraid: attr.gbraid,
          fbclid: attr.fbclid,
          cta_source: 'mattress_order_form',
          product_category: 'sewa-kasur',
          page_type: 'isolated_landing_page',
          intent: 'sewa_kasur_jogja',
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
          source: attr.source || 'isolated_lp_kasur',
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

    const messageLines = [
      'Halo Santi Living, saya ingin memesan sewa kasur busa:',
      '',
      `• Nama: ${cleanNama}`,
      `• No. WhatsApp: ${cleanWa}`,
      `• Paket Kasur: ${paket}`,
      `• Jumlah Unit: ${jumlah}`,
      `• Durasi Sewa: ${durasi}`,
      `• Area Pengantaran: ${cleanArea}`,
      `• Tanggal Mulai: ${cleanTanggal}`,
    ];
    if (catatan.trim()) {
      messageLines.push(`• Catatan Tambahan: ${catatan.trim()}`);
    }
    messageLines.push('', 'Mohon informasi ketersediaan stok dan rincian total biayanya. Terima kasih!');

    const message = messageLines.join('\n');
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
    <form onSubmit={handleSubmit} noValidate aria-label="Form pemesanan sewa kasur">
      <div className="space-y-5">
        <div>
          <label htmlFor="mattress-nama" className={labelClass}>
            Nama Lengkap
          </label>
          <input
            id="mattress-nama"
            name="nama"
            type="text"
            autoComplete="name"
            required
            placeholder="cth: Anisa Rahma"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mattress-wa" className={labelClass}>
            Nomor WhatsApp
          </label>
          <input
            id="mattress-wa"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="cth: 081234567890"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mattress-paket" className={labelClass}>
            Pilihan Paket Kasur
          </label>
          <select
            id="mattress-paket"
            name="paket"
            value={paket}
            onChange={(e) => setPaket(e.target.value)}
            className={inputClass}
          >
            {PACKAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mattress-jumlah" className={labelClass}>
              Jumlah Unit
            </label>
            <select
              id="mattress-jumlah"
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
          <div>
            <label htmlFor="mattress-durasi" className={labelClass}>
              Durasi Sewa
            </label>
            <select
              id="mattress-durasi"
              name="durasi"
              value={durasi}
              onChange={(e) => setDurasi(e.target.value)}
              className={inputClass}
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="mattress-area" className={labelClass}>
            Alamat / Area Pengantaran di Jogja
          </label>
          <input
            id="mattress-area"
            name="area"
            type="text"
            autoComplete="street-address"
            required
            placeholder="cth: Condongcatur Depok Sleman / Umbulharjo Kota Jogja / Banguntapan Bantul"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mattress-tanggal" className={labelClass}>
            Tanggal Mulai Pakai
          </label>
          <input
            id="mattress-tanggal"
            name="tanggal"
            type="text"
            required
            placeholder="cth: Hari ini / Sabtu, 18 Okt 2026"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mattress-catatan" className={labelClass}>
            Catatan Tambahan <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <textarea
            id="mattress-catatan"
            name="catatan"
            rows={3}
            placeholder="cth: Butuh antar hari ini sebelum jam 17.00, lokasi kos lt 2…"
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
            Jika WhatsApp tidak terbuka otomatis, klik di sini
          </a>
        ) : null}

        <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-slate-500">
          <span>🔒 Privasi terlindungi</span>
          <span>•</span>
          <span>⚡ Respon admin 5–15 menit</span>
          <span>•</span>
          <span>🚚 Siap antar langsung hari ini</span>
        </div>
      </div>
    </form>
  );
}
