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
  '3-5 Unit (Diskon 10%)',
  '6+ Unit (Diskon 15%)',
] as const;

const DURATION_OPTIONS = [
  '1-2 Malam',
  '3-6 Malam',
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
    'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-[#315a72] focus:ring-2 focus:ring-[#315a72]/20';
  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-700';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Form pemesanan sewa kasur"
      className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xl md:p-8"
    >
      <div className="mb-6 border-b border-stone-100 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Admin Ready • Fast Response
        </div>
        <h2 className="mt-2 text-xl font-black text-stone-900 md:text-2xl">
          Form Pemesanan Cepat
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Dapatkan konfirmasi ketersediaan kasur &amp; rincian ongkir langsung via WhatsApp.
        </p>
      </div>

      <div className="grid gap-4">
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
            className={`${inputClass} bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
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
              className={`${inputClass} bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
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
              className={`${inputClass} bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
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
            placeholder="cth: Condongcatur Depok Sleman / Umbulharjo Kota Jogja"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mattress-tanggal" className={labelClass}>
            Tanggal Mulai Sewa
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
            Catatan Tambahan <span className="font-normal text-stone-400">(opsional)</span>
          </label>
          <textarea
            id="mattress-catatan"
            name="catatan"
            rows={2}
            placeholder="cth: Butuh antar hari ini sebelum jam 17.00, lokasi kos lt 2…"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        {status === 'success' ? (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
            Data Anda berhasil dicatat! Mengalihkan ke WhatsApp...
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status !== 'idle'}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all duration-200 font-bold py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.792s.448-1.272.607-1.446c.159-.175.346-.219.462-.219s.232.003.332.008c.106.005.249-.04.39.299.144.346.491 1.198.534 1.285.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.302c-.087.087-.179.181-.077.356.101.174.45 1.743 1.956 2.083.195.044.348-.035.433-.122.106-.109.458-.535.58-.718.122-.183.243-.153.407-.092.164.061 1.042.492 1.22.58.179.088.298.132.342.208.044.075.044.436-.1 1.841z" />
          </svg>
          <span>
            {status === 'submitting'
              ? 'Mengirim…'
              : status === 'success'
                ? 'Terkirim — Membuka WhatsApp…'
                : 'Kirim Permintaan (WhatsApp)'}
          </span>
        </button>

        {status === 'success' && waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border-2 border-emerald-600 px-6 py-3 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
          >
            Klik di sini jika WhatsApp tidak terbuka otomatis
          </a>
        ) : null}

        <div className="flex flex-col items-center justify-center gap-1.5 pt-2 text-center text-xs text-stone-500 sm:flex-row sm:gap-2">
          <span className="inline-flex items-center gap-1 font-medium">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            100% Data Aman
          </span>
          <span className="hidden text-stone-300 sm:inline">•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <svg className="h-3.5 w-3.5 text-[#315a72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Fast Response WhatsApp Admin (Hesy)
          </span>
        </div>
      </div>
    </form>
  );
}
