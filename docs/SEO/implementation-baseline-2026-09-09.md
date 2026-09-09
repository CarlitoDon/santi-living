# Santi Living SEO implementation baseline

Tanggal pencatatan: 9 September 2026
Branch kerja: `feat/seo-improvements`
Domain publik yang disepakati: `https://santiliving.com`

Dokumen ini mencatat baseline sebelum batch SEO dirilis. Snapshot audit dan data keyword bukan bukti performa pelanggan. Angka ranking, traffic, dan konversi hanya boleh dilaporkan dari sumber pengukuran setelah rilis.

## Sumber dan batasan data

- Site Audit Ubersuggest: snapshot 8 September 2026.
- Data keyword dan brand: snapshot 8 September 2026, bahasa Indonesia, lokasi Indonesia/Jogja sesuai konfigurasi Ubersuggest.
- Google Search Console dan GA4 menjadi sumber baseline performa setelah akses akun tersedia.
- Microsoft Clarity sudah dimuat oleh `src/components/tracking/ClarityScript.tsx`; konektor MCP Clarity belum tersedia di sesi ini, sehingga belum ada klaim data perilaku dari Clarity.
- Tidak ada kredensial GSC, GA4, Clarity, atau Ubersuggest yang disimpan di repository.

## Site Audit: klasifikasi awal

Site Audit mencatat 3.326 halaman yang dirayapi: 1.840 berhasil, 138 redirect, 1 broken, dan 1.347 blocked. Total isu yang perlu diklasifikasikan sebelum perbaikan massal adalah 2.553.

| Kategori | Jumlah yang terlihat | Tindakan awal |
| --- | ---: | --- |
| Halaman blocked dari mesin pencari | 1.331 | Triage berdasarkan nilai halaman dan alasan blocking |
| Duplicate title | 132 | Gabungkan template metadata dan cek intent |
| Duplicate meta description | 58 | Tulis ulang hanya pada halaman yang layak diindeks |
| Title terlalu panjang | 776 | Potong melalui template per tipe halaman |
| Low word count | 9 | Review manual; jangan menambah teks filler |
| 4XX | 1 | Verifikasi route, backlink, dan redirect yang tepat |

Angka di atas adalah klasifikasi awal dari snapshot. Rekonsiliasi penuh kategori audit dilakukan dari export lengkap sebelum batch massal berikutnya.

## Aturan URL

| Alias lama | Route domain utama |
| --- | --- |
| `karpet.santiliving.com` | `/id/sewa-karpet-jogja` |
| `permadani.santiliving.com` | `/id/sewa-karpet-permadani-jogja` |
| `acara.santiliving.com` | `/id/sewa-perlengkapan-event` |
| `kipas-angin.santiliving.com` | `/id/sewa-kipas-angin` |

Alias dengan path `/en` mempertahankan locale tersebut. Path lain dialihkan ke path yang sama di domain utama. Query string dipertahankan. Redirect memakai status permanen dan tidak diterapkan pada domain utama, untuk mencegah loop.

URL canonical, Open Graph, Breadcrumb, JSON-LD, sitemap, dan internal link baru harus memakai domain utama. Helper bersama ada di `apps/web-next/src/lib/site-url.ts`.

## Permukaan utama yang dipantau

| Permukaan | URL ID | URL EN |
| --- | --- | --- |
| Homepage | `/id` | `/en` |
| Kursi | `/id/sewa-kursi-acara` | `/en/sewa-kursi-acara` |
| Karpet umum | `/id/sewa-karpet-jogja` | `/en/sewa-karpet-jogja` |
| Permadani | `/id/sewa-karpet-permadani-jogja` | `/en/sewa-karpet-permadani-jogja` |
| Event | `/id/sewa-perlengkapan-event` | `/en/sewa-perlengkapan-event` |

## Pengukuran

Event inquiry yang sudah ada dikirim melalui `GtagScript` dan endpoint lead tracking. Event utama yang dipakai untuk baseline adalah `whatsapp_click`; landing page dan kategori layanan perlu dibandingkan bersama URL, locale, dan tanggal rilis.

Minimum H+3 dan H+7:

- GSC: impressions, clicks, CTR, posisi, dan landing page.
- GA4: sesi, landing page, klik WhatsApp, dan inquiry.
- Clarity: rekaman/session insight dan hambatan pada halaman kategori setelah konektor atau akses UI tersedia.
- Ubersuggest: snapshot tambahan dengan tanggal, bahasa, lokasi, dan sumber yang ditulis bersama hasilnya.

## Jalur rilis

1. Kerjakan batch di `feat/seo-improvements`.
2. Buka PR ke `dev` dan verifikasi staging.
3. Setelah verifikasi lulus, merge `dev` ke `main` melalui CI/CD normal.
4. Catat SHA, URL deployment, hasil smoke test, dan sampel audit sebelum/sesudah.
