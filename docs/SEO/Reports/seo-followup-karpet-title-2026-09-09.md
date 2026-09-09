# SEO follow-up: duplicate title halaman karpet

Tanggal: 9 September 2026
Branch kerja: `feat/seo-followups`
Halaman: `https://santiliving.com/id/sewa-karpet-jogja`

## Temuan

Sebelum perubahan, response production menampilkan title berikut:

`Sewa Karpet & Permadani Jogja — Harga Mulai Rp25.000/Hari | Santi Living | Santi Living`

Suffix brand muncul dua kali karena page menetapkan `| Santi Living`, lalu layout locale juga menerapkan template `%s | Santi Living`.

## Perbaikan

- Menghapus suffix brand dari `PAGE_TITLE` di `apps/web-next/src/app/[locale]/sewa-karpet-jogja/page.tsx`.
- Membiarkan layout menjadi satu-satunya sumber suffix brand.
- Menambahkan `page.test.tsx` untuk memeriksa title ID/EN, canonical, Open Graph URL, robots, dan tiga JSON-LD schema pada domain utama.
- Research artifacts Ubersuggest tetap dipertahankan dan tidak ikut diubah.

## Validasi

- Focused Vitest: 3 file, 8 test passed.
- `npm run typecheck`: passed.
- Production smoke sebelum rollout patch tetap menunjukkan title ganda; perubahan ini belum diklaim live sampai melalui jalur PR `feat/seo-followups` → `dev` → `main`.

## Langkah berikutnya

1. Review klaim harga dan cakupan layanan pada money page karpet terhadap data bisnis aktual.
2. Validasi foto serta stok karpet permadani cream/gold, merah, dan hijau sebelum menonjolkannya sebagai produk.
3. Ambil export lengkap Site Audit dan klasifikasikan 2.553 isu berdasarkan nilai halaman sebelum perbaikan massal.
4. Catat baseline GSC, GA4, dan klik WhatsApp untuk pengukuran H+3/H+7 setelah rilis.
