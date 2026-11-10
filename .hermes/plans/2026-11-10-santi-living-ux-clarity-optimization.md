# Plan Rekomendasi Optimasi UX, Performa & Tracking Santi Living (Berdasarkan Audit Microsoft Clarity 90 Hari)

**Tanggal:** 10 November 2026  
**Arsitek:** Carlito (CTO)  
**Tujuan:** Mengeliminasi 18.6% Dead Clicks, memangkas Mobile LCP dari 3.0s ke <2.0s, dan mengoptimalkan conversion rate WhatsApp (saat ini 5.1%).

---

## 1. Problem Statement & Data Bukti (Microsoft Clarity)

1. **Dead Clicks (18.6% sesi)**:
   - Pengguna mobile (84%+ total trafik) sering mengetuk kartu produk, gambar, atau teks judul pada tabel harga (`PriceTable.tsx` di `/id/harga-sewa-kasur`) dan katalog (`CatalogItemCard.tsx` di homepage `/id`).
   - Namun, hanya tombol kecil "Pesan via WA" di sudut bawah kartu yang aktif. Ketukan di area kartu lainnya tidak menghasilkan respon (Dead Clicks).
2. **Mobile LCP Tinggi (3.0s - 3.2s di HP)**:
   - Hero background di homepage (`HeroBackground.tsx`) di-render di dalam client component via React hydration.
   - Browser mobile tidak mendeteksi gambar hero `hero-pengiriman-santi-living-mobile.webp` sampai JavaScript selesai diunduh dan dieksekusi.
   - Solusi: Tambahkan preload link di server head / layout metadata untuk mobile hero image.
3. **Katalog & Kartu Harga (Clickable Surface Enhancement)**:
   - Jadikan seluruh area kartu harga mobile di `PriceTable.tsx` sebagai interactive container yang memicu aksi WhatsAppLink, dengan visual feedback (tap active state).
   - Di `CatalogItemCard.tsx`, pastikan thumbnail dan info area selalu memiliki handler yang jelas.

---

## 2. Rincian Perubahan Teknis

### A. PriceTable.tsx (`apps/web-next/src/components/pricing/PriceTable.tsx`)
- Pada tampilan mobile (`md:hidden`), bungkus kartu `<article>` atau tambahkan handler interaktif sehingga mengetuk area kartu utama mengarahkan user langsung ke WhatsApp link yang sama dengan tombol CTA.
- Berikan efek `active:scale-[0.99] active:border-emerald-500 cursor-pointer` pada kartu mobile agar pengguna mendapatkan tactile feedback instan saat menyentuh layar.

### B. CatalogItemCard.tsx (`apps/web-next/src/components/home/CatalogItemCard.tsx`)
- Jika `onDetail` tidak disediakan, tetapi ada action / WhatsApp link, buat card thumbnail dan info dapat memicu aksi atau navigasi terkait alih-alih menjadi static div tanpa respon.

### C. Preload Mobile Hero Image (`apps/web-next/src/app/[locale]/page.tsx` atau layout)
- Sisipkan preload tag untuk gambar LCP pertama:
  - Mobile: `/images/hero-pengiriman-santi-living-mobile.webp` (fetchPriority="high", media="(max-width: 767px)")
  - Desktop: `/images/hero-pengiriman-santi-living.webp` (fetchPriority="high", media="(min-width: 768px)")
- Memotong LCP hingga ~1.0 - 1.2 detik di jaringan 4G Indonesia.

---

## 3. Eksekusi & Delegasi

- Implementasi diserahkan ke `omp` sesuai tata kelola engineering.
- Verifikasi via `npm test` dan `npm run typecheck`.
- Deploy ke Vercel production melalui alur PR dev -> main.
